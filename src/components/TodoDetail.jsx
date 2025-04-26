import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Heading,
  Stack,
  Alert,
  AlertIcon,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowBackIcon, CheckIcon, TimeIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTodoById, updateTodo } from "../api/todoApi";
import { saveTodoToBoth, loadTodosFromBoth } from "../utils/db";

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const boxBg = useColorModeValue("gray.50", "gray.50");
  const textColor = useColorModeValue("black", "black");
  const buttonBg = useColorModeValue("black", "white");
  const buttonIconColor = useColorModeValue("white", "black");

  useEffect(() => {
    const loadTodo = async () => {
      setLoading(true);
      try {
        const fetchedTodo = await fetchTodoById(id);
        setTodo(fetchedTodo);
      } catch (err) {
        console.error("Failed to fetch todo:", err);
        setError("Failed to fetch todo");
      } finally {
        setLoading(false);
      }
    };
    loadTodo();
  }, [id]);

  const handleToggleCompleted = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodo(id, updatedTodo);
    await saveTodoToBoth(updatedTodo);
    setTodo(updatedTodo);
  };

  useEffect(() => {
    const loadLocalTodos = async () => {
      const localTodos = await loadTodosFromBoth();
      const currentTodo = localTodos.find((todo) => todo.id === parseInt(id));
      if (currentTodo) {
        setTodo(currentTodo);
      }
    };
    loadLocalTodos();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (!todo) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Text fontSize="xl">Todo not found</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box p={6} borderRadius="md" shadow="md" bg={boxBg} mt={4}>
        <Stack spacing={4} color={textColor}>
          <Heading as="h2" size="xl">
            Todo Details
          </Heading>
          <Text fontSize="lg">
            <strong>Id:</strong> {todo.id}
          </Text>
          <Text fontSize="lg">
            <strong>Title:</strong> {todo.title}
          </Text>
          <Text fontSize="lg">
            <strong>Completed:</strong> {todo.completed ? "true" : "false"}
          </Text>
        </Stack>
        <IconButton
          icon={todo.completed ? <CheckIcon /> : <TimeIcon />}
          onClick={handleToggleCompleted}
          aria-label={todo.completed ? "Mark as pending" : "Mark as completed"}
          bg={buttonBg}
          color={buttonIconColor}
          _hover={{ bg: buttonBg }}
          ml={2}
        />
      </Box>

      <Box mt={6} display="flex" alignItems="center">
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          bg={buttonBg}
          color={buttonIconColor}
          _hover={{ bg: buttonBg }}
          mr={2}
        />
      </Box>
    </Box>
  );
};

export default TodoDetail;

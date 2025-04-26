"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Heading,
  Stack,
  Alert,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  CheckIcon,
  TimeIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { saveTodoToBoth, loadTodosFromBoth } from "../../../lib/db";

const TodoDetail = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const boxBg = useColorModeValue("gray.50", "gray.50");
  const textColor = useColorModeValue("black", "black");

  useEffect(() => {
    const loadLocalTodos = async () => {
      setLoading(true);
      try {
        const localTodos = await loadTodosFromBoth();
        const currentTodo = localTodos.find((todo) => todo.id === parseInt(id));
        if (currentTodo) {
          setTodo(currentTodo);
        } else {
          setError("Todo not found");
        }
      } catch (err) {
        console.error("Failed to load todo:", err);
        setError("Failed to load todo");
      } finally {
        setLoading(false);
      }
    };
    loadLocalTodos();
  }, [id]);

  const handleToggleCompleted = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await saveTodoToBoth(updatedTodo);
    setTodo(updatedTodo);
  };

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
          <WarningIcon />
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
          bg="white"
          color="black"
          _hover={{ bg: "gray.200" }}
          _dark={{ bg: "black", color: "black" }}
          _focus={{ boxShadow: "none" }}
          ml={2}
        />
      </Box>

      <Box mt={6} display="flex" alignItems="center">
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => router.back()}
          aria-label="Go back"
          bg="white"
          color="black"
          _hover={{ bg: "gray.200" }}
          _dark={{ bg: "black", color: "black" }}
          _focus={{ boxShadow: "none" }}
          mr={2}
        />
      </Box>
    </Box>
  );
};

export default TodoDetail;

import React, { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import {
  Box,
  Spinner,
  Input,
  Text,
  Stack,
  Heading,
  Divider,
  Alert,
  AlertIcon,
  Select,
  IconButton,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { CheckIcon, TimeIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { fetchTodos, updateTodo } from '../api/todoApi';
import { loadTodosFromBoth, saveTodoToBoth } from '../utils/db';
import debounce from 'lodash.debounce';

const AddTodo = lazy(() => import('./TodoActions').then(module => ({ default: module.AddTodo })));
const EditTodo = lazy(() => import('./TodoActions').then(module => ({ default: module.EditTodo })));
const DeleteTodo = lazy(() => import('./TodoActions').then(module => ({ default: module.DeleteTodo })));

const TodoItem = React.memo(({ todo, handleToggleCompleted, handleTodoUpdated, handleTodoDeleted }) => {
  const buttonBg = useColorModeValue('black', 'white');
  const buttonIconColor = useColorModeValue('white', 'black');

  return (
    <Box key={todo.id} p={4} borderWidth="1px" borderRadius="md">
      <Link to={`/todo/${todo.id}`}>
        <Text fontSize="lg" fontWeight="bold">
          {todo.title}
        </Text>
      </Link>
      <Stack direction="row" spacing={4} mt={2} alignItems="center">
        <IconButton
          icon={todo.completed ? <CheckIcon color="green.500" /> : <TimeIcon color="orange.500" />}
          onClick={() => handleToggleCompleted(todo.id, todo.completed)}
          aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
          bg={buttonBg}
          color={buttonIconColor}
          _hover={{ bg: buttonBg }}
        />
        <Suspense fallback={<Spinner />}>
          <EditTodo id={todo.id} title={todo.title} description={todo.description} onTodoUpdated={handleTodoUpdated} />
          <DeleteTodo id={todo.id} onTodoDeleted={handleTodoDeleted} />
        </Suspense>
      </Stack>
    </Box>
  );
});

const TodoList = ({ todos, setTodos, setLoading, setError, loading, error, deleteTodo, editTodo }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const buttonBg = useColorModeValue('black', 'white');
  const buttonIconColor = useColorModeValue('white', 'black');

useEffect(() => {
  const loadTodos = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 
      const fetchedTodos = await fetchTodos(page, 5, controller.signal); 
      setTodos(fetchedTodos);
      await saveTodoToBoth(fetchedTodos);
      clearTimeout(timeoutId); 
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      if (err.name !== 'AbortError') {
        setError(err.message);
      } else {
        setError('API request timed out');
      }
    } finally {
      setLoading(false);
    }
  };
  loadTodos();
}, [page, setTodos, setLoading, setError]);

  useEffect(() => {
    const loadLocalTodos = async () => {
      const localTodos = await loadTodosFromBoth();
      setTodos(localTodos);
    };
    loadLocalTodos();
  }, [setTodos]);

  const debouncedSearch = useMemo(() => debounce((value) => {
    setSearch(value);
  }, 300), []);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleTodoDeleted = (id) => {
    deleteTodo(id);
  };

  const handleTodoUpdated = async (id, updatedTodo) => {
    await updateTodo(id, updatedTodo);
    await saveTodoToBoth(updatedTodo);
    editTodo(id, updatedTodo);
  };

  const handleTodoCreated = (newTodo) => {
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
  };

  const handleToggleCompleted = async (id, completed) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    updatedTodo.completed = !completed;
    await updateTodo(id, updatedTodo);
    await saveTodoToBoth(updatedTodo);
    const updatedTodos = todos.map(todo => (todo.id === id ? updatedTodo : todo));
    setTodos(updatedTodos);
  };

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    const matchesSearch = todo.title && todo.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'pending' && !todo.completed);
    return matchesSearch && matchesFilter;
  }), [todos, search, filter]);

  return (
    <Box p={4}>
      <Heading mb={4}>Todo List</Heading>
      <Stack direction="row" spacing={4} mb={4}>
        <Input
          placeholder="Search todos"
          onChange={handleSearch}
          aria-label="Search todos"
        />
        <Select value={filter} onChange={handleFilterChange} aria-label="Filter todos">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </Select>
      </Stack>
      <Suspense fallback={<Spinner />}>
        <AddTodo onTodoCreated={handleTodoCreated} />
      </Suspense>
      <Divider my={4} />
      {loading ? (
        <Stack spacing={4}>
          {[...Array(5)].map((_, index) => ( 
            <Skeleton key={index} height="50px" />
          ))}
        </Stack>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Stack spacing={4}>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleToggleCompleted={handleToggleCompleted}
              handleTodoUpdated={handleTodoUpdated}
              handleTodoDeleted={handleTodoDeleted}
            />
          ))}
        </Stack>
      )}
      <Divider my={4} />
      <Box display="flex" justifyContent="space-between" mt={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          bg={buttonBg}
          color={buttonIconColor}
          _hover={{ bg: buttonBg }}
        />
        <IconButton
          icon={<ArrowForwardIcon />}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
          bg={buttonBg}
          color={buttonIconColor}
          _hover={{ bg: buttonBg }}
        />
      </Box>
    </Box>
  );
};

export default TodoList;

// todolist/src/app/page.js
"use client"; // Necessary for using hooks like useState and useEffect

import React, { useState, useEffect } from "react";
import { Box, Spinner, Heading, VStack } from "@chakra-ui/react";
import ErrorBoundary from "../components/ErrorBoundary";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";
import TodoList from "../components/TodoList";
import TodoInput from "../components/CreateTodo"; // Assuming CreateTodo is your input component

// Import your actual database functions from your db.js file
// Adjust the path '../lib/db' if you placed db.js elsewhere
import {
  loadTodosFromBoth,
  saveTodoToBoth,
  deleteTodoFromBoth,
  getTodos, // Keep getTodos imported, as refetching might be needed after saving/updating
} from "../lib/db";

const MotionBox = motion(Box);

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedTodos = await loadTodosFromBoth();
        setTodos(loadedTodos);
      } catch (err) {
        console.error("Failed to load todos:", err);
        setError("Failed to load todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (title) => {
    if (!title || !title.trim()) {
      console.log("Add cancelled: Title is empty.");
      return;
    }

    const newTodo = { title: title.trim(), completed: false };
    const tempId = "temp-" + Date.now();
    setTodos((prevTodos) => [...prevTodos, { ...newTodo, id: tempId }]);
    console.log("Optimistically added todo with temp ID:", tempId);

    try {
      const savedTodo = await saveTodoToBoth(newTodo);
      console.log("Todo successfully added and persisted:", savedTodo);

      // Refetch todos to get the real ID from Dexie
      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
    } catch (err) {
      console.error("Failed to add todo:", err);
      setError("Failed to add todo.");
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== tempId));
      alert("Failed to add todo. Please try again.");
    }
  };

  const handleEditTodo = async (id, updates) => {
    console.log(`Attempting to edit todo ${id} with updates:`, updates);

    const originalTodo = todos.find((todo) => todo.id === id);
    if (!originalTodo) {
      console.error(`Edit failed: Todo with ID ${id} not found.`);
      setError("Failed to edit todo: Todo not found.");
      return;
    }

    const updatedTodoClient = { ...originalTodo, ...updates };
    const originalTodos = todos; // Store original state for potential revert

    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodoClient : todo))
    );
    console.log(`Optimistically edited todo ${id}`);

    try {
      const savedTodo = await saveTodoToBoth(updatedTodoClient);
      console.log(
        `Successfully edited todo ${id} and persisted. Saved object:`,
        savedTodo
      );
    } catch (err) {
      console.error(`Failed to edit todo ${id}:`, err);
      setError("Failed to update todo.");
      setTodos(originalTodos);
      alert(`Failed to edit todo ${id}. Please try again.`);
    }
  };

  const handleToggleTodo = async (id, currentCompletedStatus) => {
    console.log(
      `Attempting to toggle todo ${id} from ${currentCompletedStatus}`
    );
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) {
      console.error(`Toggle failed: Todo with ID ${id} not found.`);
      setError("Failed to toggle todo: Todo not found.");
      return;
    }
    handleEditTodo(id, { completed: !currentCompletedStatus });
  };

  const handleDeleteTodo = async (id) => {
    console.log(`Attempting to delete todo ${id}`);
    const originalTodos = todos;

    try {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      console.log(`Optimistically deleted todo ${id}`);

      await deleteTodoFromBoth(id);
      console.log(`Successfully deleted todo ${id} from persistence.`);
    } catch (err) {
      console.error(`Failed to delete todo ${id}:`, err);
      setError("Failed to delete todo.");
      setTodos(originalTodos);
      alert(`Failed to delete todo ${id}. Please try again.`);
    }
  };

  if (loading) {
    return (
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Spinner size="xl" aria-label="Loading content" />{" "}
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        {" "}
        <Heading color="red.500" mb={4}>
          Error.
        </Heading>
        <Box>{error}</Box>{" "}
      </Box>
    );
  }

  return (
    <ErrorBoundary>
    {" "}
      <MotionBox p={4}>
        <ThemeToggle />
        <TodoInput onAdd={handleAddTodo} />
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          My Todo List
        </Heading>
        {" "}
        <TodoList
          todos={todos}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          onToggle={handleToggleTodo}
        />
        {" "}
      </MotionBox>
      {" "}
    </ErrorBoundary>
  );
};

export default Page;

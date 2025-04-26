// todolist/src/app/page.js
"use client"; // Necessary for using hooks like useState and useEffect

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ErrorBoundary from "../components/ErrorBoundary";
import ThemeToggle from "../components/ThemeToggle";
import TodoList from "../components/TodoList";
import TodoInput from "../components/CreateTodo"; // Assuming CreateTodo is your input component

// Import your actual database functions from your db.js file
// Adjust the path '../lib/db' if you placed db.js elsewhere
import {
  loadTodosFromBoth,
  saveTodoToBoth,
  deleteTodoFromBoth,
} from "../lib/db";

const MotionDiv = motion.div;

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const loadedTodos = await loadTodosFromBoth();
        setTodos(loadedTodos);
      } catch (err) {
        setError("Failed to load todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (title) => {
    try {
      const newTodo = { title, completed: false };
      const savedTodo = await saveTodoToBoth(newTodo);
      setTodos((prevTodos) => [...prevTodos, savedTodo]);
    } catch (err) {
      setError("Failed to add todo.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodoFromBoth(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  const handleEditTodo = async (id, updates) => {
    const originalTodo = todos.find((todo) => todo.id === id);
    if (!originalTodo) {
      setError("Failed to edit todo: Todo not found.");
      return;
    }

    const updatedTodoClient = { ...originalTodo, ...updates };
    const originalTodos = todos;

    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodoClient : todo))
    );

    try {
      await saveTodoToBoth(updatedTodoClient);
    } catch (err) {
      setError("Failed to update todo.");
      setTodos(originalTodos);
    }
  };

  const handleToggleTodo = async (id, currentCompletedStatus) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) {
      setError("Failed to toggle todo: Todo not found.");
      return;
    }
    handleEditTodo(id, { completed: !currentCompletedStatus });
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div
          className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"
          aria-label="Loading content"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-red-500 mb-4">Error</h1>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <MotionDiv className="p-4">
        <ThemeToggle />
        <TodoInput onAdd={handleAddTodo} />
        <h1 className="text-2xl font-bold text-center mb-6">My Todo List</h1>
        <TodoList
          todos={todos}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          onToggle={handleToggleTodo}
        />
      </MotionDiv>
    </ErrorBoundary>
  );
};

export default Page;

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
  getPaginatedTodos,
  getTodos,
} from "../lib/db";

import { WorkspaceTodos } from "../lib/api"; // Import the function to fetch default todos from the JSON API

const MotionDiv = motion.div;

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalTodos, setTotalTodos] = useState(0);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const paginatedTodos = await getPaginatedTodos(itemsPerPage, offset);
        const allTodos = await getTodos(); // Fetch all todos to calculate total count
        setTotalTodos(allTodos.length);
        setTodos(paginatedTodos);

        if (paginatedTodos.length === 0 && currentPage === 1) {
          // If local database is empty, fetch default todos from the JSON API
          const defaultTodos = await WorkspaceTodos();

          // Save the fetched todos into the local database
          for (const todo of defaultTodos) {
            await saveTodoToBoth(todo);
          }

          // Reload todos from the local database
          const reloadedTodos = await getPaginatedTodos(itemsPerPage, offset);
          setTodos(reloadedTodos);
          setTotalTodos(defaultTodos.length);
        }
      } catch (err) {
        setError("Failed to load todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [currentPage]);

  const handleAddTodo = async (title) => {
    try {
      const newTodo = { title, completed: false };
      const savedTodo = await saveTodoToBoth(newTodo);
      setTodos((prevTodos) => [...prevTodos, savedTodo]);
      setTotalTodos((prevTotal) => prevTotal + 1);
    } catch (err) {
      setError("Failed to add todo.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodoFromBoth(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setTotalTodos((prevTotal) => prevTotal - 1);
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  const handleEditTodo = async (id, updates) => {
    console.log("Edit Todo Updates:", updates); // Debugging log
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    setTodos(updatedTodos);
    await saveTodoToBoth(updatedTodos.find((todo) => todo.id === id));
  };

  const handleToggleTodo = async (id, currentCompletedStatus) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) {
      setError("Failed to toggle todo: Todo not found.");
      return;
    }
    handleEditTodo(id, { completed: !currentCompletedStatus });
  };

  const totalPages = Math.ceil(totalTodos / itemsPerPage);

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
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md"
          >
            Next
          </button>
        </div>
      </MotionDiv>
    </ErrorBoundary>
  );
};

export default Page;

// todolist/src/app/page.js
"use client"; // Necessary for using hooks like useState and useEffect

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import ErrorBoundary from "../components/ErrorBoundary"; // Ensure this is correctly migrated
import ThemeToggle from "../components/ThemeToggle"; // Ensure this is correctly migrated
import TodoList from "../components/TodoList"; // Ensure this is correctly migrated
import { AddTodo } from "../components/TodoActions"; // Import AddTodo from TodoActions

// Import your actual database functions from your db.js file
// Adjust the path '../lib/db' if you placed db.js elsewhere
import {
  loadTodosFromBoth, // Used for initial load if local DB is empty
  saveTodoToBoth,
  deleteTodoFromBoth,
  getPaginatedTodos, // Used for fetching paginated data
  getTodos, // Used for getting total count
} from "../lib/db";

import { WorkspaceTodos } from "../lib/api"; // Used for fetching default todos from the JSON API

const MotionDiv = motion.div;

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set items per page
  const [totalTodos, setTotalTodos] = useState(0); // Effect to fetch todos based on current page or initial load

  useEffect(() => {
    const fetchTodos = async () => {
      console.log("Starting initial todo fetch.");
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const paginatedTodos = await getPaginatedTodos(itemsPerPage, offset);
        console.log(
          "Paginated todos length:",
          paginatedTodos.length,
          "Current page:",
          currentPage
        );

        const allTodos = await getTodos(); // Fetch all todos to calculate total count
        setTotalTodos(allTodos.length);
        setTodos(paginatedTodos);

        if (paginatedTodos.length === 0 && currentPage === 1) {
          console.log("No todos found in local DB. Fetching from API...");
          const defaultTodos = await WorkspaceTodos();
          console.log("Default todos fetched from API:", defaultTodos);

          console.log("Saving default todos to local DB...");
          for (const todo of defaultTodos) {
            await saveTodoToBoth(todo);
          }
          console.log("Default todos saved to local DB.");

          console.log("Reloading todos from local DB...");
          const reloadedTodos = await getPaginatedTodos(itemsPerPage, offset);
          console.log("Reloaded todos:", reloadedTodos);
          setTodos(reloadedTodos);
          setTotalTodos(defaultTodos.length); // Update total count
        }
      } catch (err) {
        console.error("Failed to load todos:", err);
        setError("Failed to load todos.");
      } finally {
        setLoading(false);
        console.log("Todo fetch process finished.");
      }
    };

    fetchTodos();
  }, [currentPage, itemsPerPage]); // Added itemsPerPage as dependency // Handler to add a new todo // Receives the new todo object from the AddTodo component

  const handleAddTodo = async (newTodo) => {
    try {
      console.log("handleAddTodo: Received newTodo object:", newTodo); // Debugging log // Save the new todo to the database
      await saveTodoToBoth(newTodo);
      console.log("handleAddTodo: Todo saved to DB."); // Re-fetch the current page data to update the list with the new todo

      // This ensures the list reflects the data in the database after saving
      const offset = (currentPage - 1) * itemsPerPage;
      const paginatedTodos = await getPaginatedTodos(itemsPerPage, offset);
      setTodos(paginatedTodos); // Update state with the new paginated data // Update the total count of todos

      const allTodos = await getTodos();
      setTotalTodos(allTodos.length);

      console.log("handleAddTodo: State updated after saving and re-fetching.");
    } catch (err) {
      console.error("handleAddTodo: Failed to add todo:", err);
      setError("Failed to add todo.");
    }
  }; // Handler to delete a todo

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodoFromBoth(id); // Re-fetch the current page data after deleting

      const offset = (currentPage - 1) * itemsPerPage;
      const paginatedTodos = await getPaginatedTodos(itemsPerPage, offset);
      setTodos(paginatedTodos); // Update state with the new paginated data // Update the total count of todos

      const allTodos = await getTodos();
      setTotalTodos(allTodos.length);
    } catch (err) {
      setError("Failed to delete todo.");
    }
  }; // Handler to edit a todo

  const handleEditTodo = async (id, updates) => {
    console.log("handleEditTodo called with:", { id, updates }); // Debugging log
    console.log("handleEditTodo: Received updates:", updates); // Debugging log

    try {
      // Find the todo to update to include its current completed status
      const todoToUpdate = await getTodos().then((todos) =>
        todos.find((todo) => todo.id === id)
      );
      if (!todoToUpdate) {
        console.error("handleEditTodo: Todo not found for update.");
        setError("Failed to update todo: Todo not found.");
        return;
      }
      const updatedTodo = { ...todoToUpdate, ...updates }; // Save the updated todo to the database

      await saveTodoToBoth(updatedTodo);
      console.log("handleEditTodo: Todo updated in DB."); // Re-fetch the current page data after editing

      const offset = (currentPage - 1) * itemsPerPage;
      const paginatedTodos = await getPaginatedTodos(itemsPerPage, offset);
      setTodos(paginatedTodos); // Update state with the new paginated data

      // Total count doesn't change on edit, no need to update setTotalTodos

      console.log(
        "handleEditTodo: State updated after editing and re-fetching."
      );
    } catch (err) {
      console.error("handleEditTodo: Failed to update todo:", err);
      setError("Failed to update todo.");
    }
  }; // Handler to toggle todo completion

  const handleToggleTodo = async (id, currentCompletedStatus) => {
    console.log("handleToggleTodo called with:", {
      id,
      currentCompletedStatus,
    }); // Debugging log
    await handleEditTodo(id, { completed: !currentCompletedStatus });
  };

  const totalPages = Math.ceil(totalTodos / itemsPerPage);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen dark:bg-gray-900 dark:text-gray-200">
        <div
          className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full dark:border-blue-300"
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
      <MotionDiv className="p-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <AddTodo onTodoCreated={handleAddTodo} />
          <ThemeToggle />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">My Todo List</h1>
        <TodoList
          todos={todos}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          onToggleComplete={handleToggleTodo} // Updated prop name to match TodoList's expected prop
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 border-2 rounded-full bg-white hover:bg-gray-200 dark:bg-white dark:hover:bg-gray-300"
            aria-label="Previous page"
          >
            <AiOutlineLeft className="w-5 h-5 dark:text-black" />
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-1 border-2 rounded-full bg-white hover:bg-gray-200 dark:bg-white dark:hover:bg-gray-300"
            aria-label="Next page"
          >
            <AiOutlineRight className="w-5 h-5 dark:text-black" />
          </button>
        </div>
      </MotionDiv>
    </ErrorBoundary>
  );
};

export default Page;

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveTodoToBoth, loadTodosFromBoth } from "../../../lib/db";

const TodoDetail = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="flex justify-center items-center h-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Todo not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="p-6 border rounded-md shadow-md bg-gray-50">
        <h2 className="text-xl font-bold">Todo Details</h2>
        <p className="text-lg">
          <strong>Id:</strong> {todo.id}
        </p>
        <p className="text-lg">
          <strong>Title:</strong> {todo.title}
        </p>
        <p className="text-lg">
          <strong>Completed:</strong> {todo.completed ? "true" : "false"}
        </p>
        <Button
          onClick={handleToggleCompleted}
          className={`mt-4 ${
            todo.completed ? "bg-green-500" : "bg-yellow-500"
          } text-white`}
        >
          {todo.completed ? "Mark as Pending" : "Mark as Completed"}
        </Button>
      </div>

      <div className="mt-6">
        <Button
          onClick={() => router.back()}
          className="bg-gray-500 text-white"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default TodoDetail;

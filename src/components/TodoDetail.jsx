import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineCheck,
  AiOutlineClockCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { loadTodosFromBoth, saveTodoToBoth } from "../lib/db";

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTodo = async (id) => {
      setLoading(true);
      try {
        const todos = await loadTodosFromBoth();
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
          setTodo(todo);
        } else {
          setError("Todo not found.");
        }
      } catch (err) {
        setError("Failed to load todo.");
      } finally {
        setLoading(false);
      }
    };
    loadTodo(id);
  }, [id]);

  const handleToggleCompleted = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await saveTodoToBoth(updatedTodo);
    setTodo(updatedTodo);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ color: "red" }}>
          <AiOutlineWarning />
          {error}
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ fontSize: "20px" }}>Todo not found</div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f9f9f9",
          marginTop: "16px",
        }}
      >
        <div style={{ marginBottom: "16px", color: "#000" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Todo Details</h2>
          <p style={{ fontSize: "18px" }}>
            <strong>Id:</strong> {todo.id}
          </p>
          <p style={{ fontSize: "18px" }}>
            <strong>Title:</strong> {todo.title}
          </p>
          <p style={{ fontSize: "18px" }}>
            <strong>Completed:</strong> {todo.completed ? "true" : "false"}
          </p>
        </div>
        <button
          onClick={handleToggleCompleted}
          aria-label={todo.completed ? "Mark as pending" : "Mark as completed"}
          style={{
            backgroundColor: todo.completed ? "#000" : "#fff",
            color: todo.completed ? "#fff" : "#000",
            border: "none",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "8px",
          }}
        >
          {todo.completed ? <AiOutlineCheck /> : <AiOutlineClockCircle />}
        </button>
      </div>

      <div style={{ marginTop: "24px", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "8px",
          }}
        >
          <AiOutlineArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default TodoDetail;

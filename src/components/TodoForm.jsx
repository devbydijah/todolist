import React, { useState } from "react";
import PropTypes from "prop-types";

const TodoForm = ({ addTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure title is not empty or whitespace
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    // Clear error and proceed with adding the task
    setError("");
    const newTodo = { id: Date.now(), title, description, completed: false };
    addTodo(newTodo); // Ensure addTodo is called correctly

    // Reset form fields
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
};

TodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired,
};

export default TodoForm;

"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button"; // Import Shadcn UI Button
import {
  HiOutlinePencilAlt,
  HiOutlineCheck,
  HiOutlineTrash,
} from "react-icons/hi"; // Import icons
import { EditTodo } from "./TodoActions"; // Import EditTodo component

const TodoItem = React.memo(({ todo, onToggleComplete, onEdit, onDelete }) => {
  console.log("TodoItem received onToggleComplete:", onToggleComplete); // Debugging log

  const [isEditOpen, setIsEditOpen] = useState(false); // State to control dialog visibility

  return (
    <li className="todo-card p-4 border rounded-md shadow-md">
      <div className="todo-content mb-4">
        <span
          className={
            todo.completed ? "completed font-bold line-through" : "font-bold"
          }
        >
          {todo.title}
        </span>
        <p className="todo-description text-sm text-gray-600 mt-2">
          {todo.description}
        </p>
      </div>
      <div className="todo-actions flex gap-2">
        <EditTodo
          id={todo.id}
          title={todo.title}
          description={todo.description}
          completed={todo.completed}
          onTodoUpdated={onEdit}
        >
          <Button
            className="ml-2 flex items-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-300"
            aria-label="Edit todo"
          >
            <HiOutlinePencilAlt className="icon mr-2" />
            <span>Edit</span>
          </Button>
        </EditTodo>
        <Button
          className="complete-button border bg-green-700 text-white p-2 rounded-md flex items-center gap-2"
          onClick={() => onToggleComplete(todo.id, todo.completed)}
          title={todo.completed ? "Mark Incomplete" : "Mark Complete"}
        >
          <HiOutlineCheck className="icon mr-2" />
          <span>{todo.completed ? "Mark Incomplete" : "Mark Complete"}</span>
        </Button>
        <Button
          className="delete-button border bg-red-700 text-white p-2 rounded-md flex items-center gap-2"
          onClick={() => onDelete(todo.id)}
          title="Delete Task"
        >
          <HiOutlineTrash className="icon mr-2" />
          <span>Delete</span>
        </Button>
      </div>
    </li>
  );
});

const TodoList = ({ todos, onToggleComplete, onDelete, onEdit }) => {
  console.log("TodoList received onToggleComplete:", onToggleComplete); // Debugging log

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Filter and search logic
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      ?.toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    if (filter === "completed") {
      return todo.completed && matchesSearch;
    } else if (filter === "incomplete") {
      return !todo.completed && matchesSearch;
    }

    return matchesSearch;
  });

  return (
    <div>
      <div className="search-container flex items-center gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2 w-full"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>
      <ul className="todo-list space-y-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => {
            console.log("Mapping todo, onToggleComplete:", onToggleComplete); // Debugging log
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>
    </div>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      completed: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TodoList;

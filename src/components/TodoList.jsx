import React, { useState, lazy, Suspense, useMemo } from "react";
import {
  AiOutlineWarning,
  AiOutlineCheck,
  AiOutlineClockCircle,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import Link from "next/link";
import { saveTodoToBoth, deleteTodoFromBoth } from "../lib/db";
import debounce from "lodash.debounce";

const EditTodo = lazy(() =>
  import("./TodoActions").then((module) => ({ default: module.EditTodo }))
);
const DeleteTodo = lazy(() =>
  import("./TodoActions").then((module) => ({ default: module.DeleteTodo }))
);

const TodoItem = React.memo(
  ({ todo, handleToggleCompleted, handleTodoUpdated, handleTodoDeleted }) => {
    return (
      <div key={todo.id} className="p-4 border rounded-md mb-4">
        <Link href={`/todo/${todo.id}`}>
          <p className="text-lg font-bold">{todo.title}</p>
        </Link>
        <p className="text-sm text-gray-600">{todo.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleToggleCompleted(todo.id, todo.completed)}
            aria-label={
              todo.completed ? "Mark as pending" : "Mark as completed"
            }
            className="p-2 border rounded-md"
          >
            {todo.completed ? (
              <AiOutlineCheck className="text-green-500" />
            ) : (
              <AiOutlineClockCircle className="text-orange-500" />
            )}
          </button>
          <Suspense fallback={<div>Loading...</div>}>
            <EditTodo
              id={todo.id}
              title={todo.title}
              description={todo.description}
              onTodoUpdated={handleTodoUpdated}
            />
            <DeleteTodo id={todo.id} onTodoDeleted={handleTodoDeleted} />
          </Suspense>
        </div>
      </div>
    );
  }
);

const TodoList = ({ todos, loading, error, onDelete, onEdit }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
      }, 300),
    []
  );

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && todo.completed) ||
        (filter === "pending" && !todo.completed);
      return matchesSearch && matchesFilter;
    });
  }, [todos, search, filter]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search todos..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="p-2 border rounded-md"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggleCompleted={onEdit}
          handleTodoUpdated={onEdit}
          handleTodoDeleted={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;

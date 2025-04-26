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

const AddTodo = lazy(() =>
  import("./TodoActions").then((module) => ({ default: module.AddTodo }))
);
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

const TodoList = ({ todos, loading, error, deleteTodo, editTodo }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
      }, 300),
    []
  );

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleTodoUpdated = async (id, updatedTodo) => {
    await saveTodoToBoth(updatedTodo);
    editTodo(id, updatedTodo);
  };

  const handleTodoCreated = (newTodo) => {
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
  };

  const handleToggleCompleted = async (id, completed) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
    updatedTodo.completed = !completed;
    await saveTodoToBoth(updatedTodo);
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
  };

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) => {
        const matchesSearch =
          todo.title && todo.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
          filter === "all" ||
          (filter === "completed" && todo.completed) ||
          (filter === "pending" && !todo.completed);
        return matchesSearch && matchesFilter;
      }),
    [todos, search, filter]
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search todos"
          onChange={handleSearch}
          aria-label="Search todos"
          className="p-2 border rounded-md w-full"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          aria-label="Filter todos"
          className="p-2 border rounded-md"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <AddTodo onTodoCreated={handleTodoCreated} />
      </Suspense>
      <hr className="my-4" />
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-300 rounded-md" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 flex items-center gap-2">
          <AiOutlineWarning />
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleToggleCompleted={handleToggleCompleted}
              handleTodoUpdated={handleTodoUpdated}
              handleTodoDeleted={deleteTodo}
            />
          ))}
        </div>
      )}
      <hr className="my-4" />
      <div className="flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="p-2 border rounded-md"
        >
          <AiOutlineArrowLeft />
        </button>
        <button
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
          className="p-2 border rounded-md"
        >
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

export default TodoList;

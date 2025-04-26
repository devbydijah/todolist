import React, { useState } from "react";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
} from "react-icons/ai";
import { saveTodoToBoth, deleteTodoFromBoth } from "../lib/db";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AddTodo = ({ onTodoCreated = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    const newTodo = { id: Date.now(), title, description, completed: false };
    await saveTodoToBoth(newTodo);
    onTodoCreated(newTodo);
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className="bg-black text-white border border-black dark:bg-white dark:text-black dark:border-white p-2 rounded flex items-center gap-2"
            onClick={() => setIsOpen(true)}
          >
            <AiOutlinePlus className="icon" />
            Add Todo
          </button>
        </DialogTrigger>
        <DialogContent className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold dark:text-gray-200">
              Create New Todo
            </DialogTitle>
            <DialogClose className="absolute top-2 right-2 dark:text-gray-200" />
          </DialogHeader>
          <DialogDescription
            id="add-todo-description"
            className="dark:text-gray-400"
          >
            Fill in the details for your new todo item.
          </DialogDescription>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium dark:text-gray-200"
              >
                Title
              </label>
              <Input
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium dark:text-gray-200"
              >
                Description
              </label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              onClick={handleCreate}
              className="bg-black border border-black text-white hover:bg-gray-800 dark:bg-white dark:border-white dark:text-black dark:hover:bg-gray-300"
              aria-label="Create todo"
            >
              <AiOutlineCheck className="mr-1" /> Create
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const EditTodo = ({
  id,
  title: initialTitle = "",
  description: initialDescription = "",
  completed: initialCompleted = false,
  onTodoUpdated = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleUpdate = async () => {
    if (!title.trim()) {
      console.error("Title is required.");
      return;
    }
    const updatedTodo = {
      id,
      title: title.trim(),
      description,
      completed: initialCompleted,
    };
    console.log("Updated Todo:", updatedTodo); // Debugging log
    await saveTodoToBoth(updatedTodo);
    onTodoUpdated(id, updatedTodo);
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="ml-2 flex items-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
            aria-label="Edit todo"
          >
            <AiOutlineEdit className="mr-1" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold dark:text-gray-200">
              Edit Todo
            </DialogTitle>
            <DialogClose className="absolute top-2 right-2 dark:text-gray-200" />
          </DialogHeader>
          <DialogDescription className="dark:text-gray-400">
            Make changes to this todo item.
          </DialogDescription>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium dark:text-gray-200"
              >
                Title
              </label>
              <Input
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium dark:text-gray-200"
              >
                Description
              </label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              onClick={handleUpdate}
              className="bg-black border border-black text-white hover:bg-gray-800 dark:bg-white dark:border-white dark:text-black dark:hover:bg-gray-300"
              aria-label="Update todo"
            >
              <AiOutlineCheck className="mr-1" /> Update
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const DeleteTodo = ({ id, onTodoDeleted = () => {} }) => {
  const handleDelete = async () => {
    await deleteTodoFromBoth(id);
    onTodoDeleted(id);
  };

  return (
    <Button
      onClick={handleDelete}
      className="ml-2 flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
      aria-label="Delete todo"
    >
      <AiOutlineDelete /> Delete
    </Button>
  );
};

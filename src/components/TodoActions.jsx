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
          <Button
            className="mb-4 flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            aria-label="Add new todo"
          >
            <AiOutlinePlus /> Add Todo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">Create New Todo</h2>
            <DialogClose className="absolute top-2 right-2">&times;</DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              onClick={handleCreate}
              className="bg-blue-500 text-white hover:bg-blue-600"
              aria-label="Create todo"
            >
              <AiOutlineCheck /> Create
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100"
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
  onTodoUpdated = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleUpdate = async () => {
    const updatedTodo = { id, title, description, completed: false };
    await saveTodoToBoth(updatedTodo);
    onTodoUpdated(id, updatedTodo);
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="ml-2 flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            aria-label="Edit todo"
          >
            <AiOutlineEdit /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">Edit Todo</h2>
            <DialogClose className="absolute top-2 right-2">&times;</DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              onClick={handleUpdate}
              className="bg-blue-500 text-white hover:bg-blue-600"
              aria-label="Update todo"
            >
              <AiOutlineCheck /> Update
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100"
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
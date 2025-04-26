import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { saveTodoToBoth } from "../lib/db";

const CreateTodo = ({ onTodoCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    try {
      const newTodo = { title, completed: false };
      const createdTodo = await saveTodoToBoth(newTodo);
      onTodoCreated(createdTodo);
      setTitle("");
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4" aria-label="Create new todo">
            Create Todo
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
                aria-label="Todo title"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button onClick={handleCreate} aria-label="Create todo">
              Create
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTodo;

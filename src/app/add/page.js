"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveTodoToBoth } from "../../lib/db";

const page = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleAddTodo = async () => {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      await saveTodoToBoth({ title, completed: false });
      alert("Todo added successfully!");
      router.push("/");
    } catch (err) {
      alert("Failed to add todo.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Input
        placeholder="Enter todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleAddTodo} className="bg-blue-500 text-white">
        Add Todo
      </Button>
    </div>
  );
};

export default page;

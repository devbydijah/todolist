"use client";

import React, { useState } from "react";
import { Box, Input, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { saveTodoToBoth } from "../../lib/db";

const page = () => {
  const [title, setTitle] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleAddTodo = async () => {
    if (!title.trim()) {
      toast({
        title: "Title is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await saveTodoToBoth({ title, completed: false });
      toast({
        title: "Todo added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } catch (err) {
      toast({
        title: "Failed to add todo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxW="md" mx="auto">
      <Input
        placeholder="Enter todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={4}
      />
      <Button colorScheme="blue" onClick={handleAddTodo}>
        Add Todo
      </Button>
    </Box>
  );
};

export default page;

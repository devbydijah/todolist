import React, { useState } from 'react';
import { Box, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import { addTodo as apiAddTodo } from '../api/todoApi';

const CreateTodo = ({ onTodoCreated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');

  const handleCreate = async () => {
    try {
      const newTodo = { title, completed: false };
      const createdTodo = await apiAddTodo(newTodo);
      onTodoCreated(createdTodo);
      setTitle('');
      onClose();
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="teal" mb={4} aria-label="Create new todo">Create Todo</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-label="Todo title"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreate} aria-label="Create todo">Create</Button>
            <Button variant="ghost" onClick={onClose} ml={3}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateTodo;
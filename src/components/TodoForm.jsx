import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Input, useColorModeValue, Stack, FormControl, FormLabel } from '@chakra-ui/react';

const TodoForm = ({ addTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const newTodo = { id: Date.now(), title, description, completed: false };
      addTodo(newTodo);
      setTitle('');
      setDescription('');
    }
  };

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Box as="form" onSubmit={handleSubmit} bg={bgColor} color={textColor} p={6} borderRadius="md" shadow="md">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input
            id="description"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" size="lg">Add Todo</Button>
      </Stack>
    </Box>
  );
};

TodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired,
};

export default TodoForm;
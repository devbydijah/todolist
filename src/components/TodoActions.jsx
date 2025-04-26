import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Stack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { saveTodoToBoth, deleteTodoFromBoth } from '../utils/db';

export const AddTodo = ({ onTodoCreated = () => {} }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const buttonBg = useColorModeValue('black', 'white');
  const buttonIconColor = useColorModeValue('white', 'black');

  const handleCreate = async () => {
    const newTodo = { id: Date.now(), title, description, completed: false };
    await saveTodoToBoth(newTodo);
    onTodoCreated(newTodo);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Box>
      <IconButton
        icon={<AddIcon />}
        onClick={onOpen}
        aria-label="Add new todo"
        bg={buttonBg}
        color={buttonIconColor}
        _hover={{ bg: buttonBg }}
        mb={4}
      />
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
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <IconButton
              icon={<CheckIcon />}
              onClick={handleCreate}
              aria-label="Create todo"
              bg={buttonBg}
              color={buttonIconColor}
              _hover={{ bg: buttonBg }}
              mr={3}
            />
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export const EditTodo = ({ id, title: initialTitle = '', description: initialDescription = '', onTodoUpdated = () => {} }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const buttonBg = useColorModeValue('black', 'white');
  const buttonIconColor = useColorModeValue('white', 'black');

  const handleUpdate = async () => {
    const updatedTodo = { id, title, description, completed: false };
    await saveTodoToBoth(updatedTodo);
    onTodoUpdated(id, updatedTodo);
    onClose();
  };

  return (
    <Box>
      <IconButton
        icon={<EditIcon />}
        onClick={onOpen}
        aria-label="Edit todo"
        bg={buttonBg}
        color={buttonIconColor}
        _hover={{ bg: buttonBg }}
        ml={2}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <IconButton
              icon={<CheckIcon />}
              onClick={handleUpdate}
              aria-label="Update todo"
              bg={buttonBg}
              color={buttonIconColor}
              _hover={{ bg: buttonBg }}
              mr={3}
            />
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export const DeleteTodo = ({ id, onTodoDeleted = () => {} }) => {
  const buttonBg = useColorModeValue('black', 'white');
  const buttonIconColor = useColorModeValue('white', 'black');

  const handleDelete = async () => {
    await deleteTodoFromBoth(id);
    onTodoDeleted(id);
  };

  return (
    <IconButton
      icon={<DeleteIcon />}
      onClick={handleDelete}
      aria-label="Delete todo"
      bg={buttonBg}
      color={buttonIconColor}
      _hover={{ bg: buttonBg }}
      ml={2}
    />
  );
};
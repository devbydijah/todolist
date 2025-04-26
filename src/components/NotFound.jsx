import React from 'react';
import { Box, Text, Stack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon, } from '@chakra-ui/icons';

const NotFound = () => {
  const navigate = useNavigate();
  const buttonBg = useColorModeValue('black', 'white');
  const buttonIconColor = useColorModeValue('white', 'black');

  return (
    <Box p={4} textAlign="center" height="100vh" display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={4} align="center">
        <Text fontSize="4xl" color="red.500">404 - Page Not Found</Text>
        <Text fontSize="lg">The page you are looking for does not exist.</Text>
        <Stack direction="row" spacing={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            aria-label="Go back"
            bg={buttonBg}
            color={buttonIconColor}
            _hover={{ bg: buttonBg }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default NotFound;
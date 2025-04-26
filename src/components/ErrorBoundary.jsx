import React, { Component } from 'react';
import { Box, Text, Button, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} textAlign="center" height="100vh" display="flex" alignItems="center" justifyContent="center">
          <Stack spacing={4} align="center">
            <Text fontSize="4xl" color="red.500">Something went wrong.</Text>
            <Button as={Link} to="/" colorScheme="teal" size="lg">
              Go to Home
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
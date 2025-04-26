import React from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <MoonIcon color="white" /> : <SunIcon color="black" />}
      aria-label="Toggle theme"
      margin="1rem"
      bg={colorMode === "light" ? "black" : "white"}
      color={colorMode === "light" ? "white" : "black"}
      _hover={{
        bg: colorMode === "light" ? "gray.700" : "gray.300",
      }}
    />
  );
};

export default ThemeToggle;

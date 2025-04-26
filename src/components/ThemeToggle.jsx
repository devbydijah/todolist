import React from "react";
import { useTheme } from "next-themes";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      className="p-2 rounded-full border bg-black dark:bg-white border-gray-400 dark:border-gray-600 hover:bg-gray-700 dark:hover:bg-gray-300"
    >
      {theme === "light" ? (
        <HiOutlineMoon className="text-white w-6 h-6" />
      ) : (
        <HiOutlineSun className="text-black w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;

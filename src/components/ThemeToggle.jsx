import React from "react";

const ThemeToggle = () => {
  return (
    <button
      onClick={() => {}}
      aria-label="Toggle theme"
      style={{
        margin: "1rem",
        backgroundColor: "black",
        color: "white",
        hover: {
          backgroundColor: "gray",
        },
      }}
    >
      Toggle Theme
    </button>
  );
};

export default ThemeToggle;

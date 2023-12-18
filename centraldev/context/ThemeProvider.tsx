"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface themeContextType {
  mode: string;
  setMode: (mode: string) => void;
}
const themeContext = createContext<themeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("");

  const handleThemeChange = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode("dark");
      document.documentElement.classList.add("dark");
    } else {
      setMode("light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  console.log("MODE: ", mode);
  return (
    <themeContext.Provider value={{ mode, setMode }}>
      {children}
    </themeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(themeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

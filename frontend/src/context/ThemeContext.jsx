// src/context/ThemeContext.jsx — NO Router inside, clean context only
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() =>
    localStorage.getItem("taxease_theme") || "system"
  );
  const [resolved, setResolved] = useState("dark");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const effective = mode === "system" ? (mq.matches ? "dark" : "light") : mode;
      setResolved(effective);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(effective);
      document.documentElement.setAttribute("data-theme", effective);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode]);

  const setTheme = (newMode) => {
    setMode(newMode);
    localStorage.setItem("taxease_theme", newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

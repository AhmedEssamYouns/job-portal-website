import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize themeMode from local storage or default to 'light'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') ? localStorage.getItem('themeMode') : 'light';
  });

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save the new theme to local storage
  };

  // Optional: Add a useEffect to update local storage when themeMode changes
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

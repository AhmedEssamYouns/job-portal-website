// theme.js
import { createTheme } from '@mui/material/styles';

const theme = {
  light: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', // Example primary color
      },
      secondary: {
        main: '#dc004e', // Example secondary color
      },
      background: {
        default: '#f2f2f2',
        paper: '#f5f5f5', // Light mode paper background
      },
      text: {
        primary: '#000000', // Text color for light mode
        secondary: '#555555', // Secondary text color
      },
    },
    typography: {
      fontFamily: 'Itim, cursive', // Set Itim font as default
      allVariants: {
        fontFamily: 'Itim, cursive', // Apply Itim font to all text variants
      },
    },
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9', // Example primary color for dark mode
      },
      secondary: {
        main: '#f48fb1', // Example secondary color for dark mode
      },
      background: {
        default: '#121212', // Dark mode background
        paper: '#1e1e1e', // Dark mode paper background
      },
      text: {
        primary: '#ffffff', // Text color for dark mode
        secondary: '#e0e0e0', // Secondary text color
      },
    },
    typography: {
      fontFamily: 'Itim, cursive', // Set Itim font as default
      allVariants: {
        fontFamily: 'Itim, cursive', // Apply Itim font to all text variants
      },
    },
  }),
};

export default theme;

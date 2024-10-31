import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import theme from './styles/theme';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { checkLogin } from './api/users';
import CourseDetail from './pages/CourseDetail';
import LevelDetail from './pages/LevelDetail';
import Fotter from './components/Fotter'
const App = () => {
  const { themeMode } = useThemeContext();
  const isLoggedIn = checkLogin(); // Check if the user is logged in

  return (
    <ThemeProvider theme={theme[themeMode]}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: theme[themeMode].palette.background.default,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={isLoggedIn ? <HomePage /> : <SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/course/:courseId/level/:levelId" element={<LevelDetail/>} />
          </Routes>
        </Router>
        <Fotter />
      </Box>
    </ThemeProvider>
  );
};

export default App;

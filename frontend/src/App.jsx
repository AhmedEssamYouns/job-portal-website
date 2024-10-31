import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import theme from './styles/theme';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { checkLogin } from './api/users';
import CourseDetail from './pages/CourseDetail';
import LevelDetail from './pages/LevelDetail';
import Footer from './components/Fotter';
import CoursesPage from './pages/CoursePage';
import UserProfile from './pages/Profile';

const App = () => {
  const { themeMode } = useThemeContext();
  const isLoggedIn = checkLogin(); // Check if the user is logged in

  return (
    <ThemeProvider theme={theme[themeMode]}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: theme[themeMode].palette.background.default,
          minHeight: '100vh', // Changed to 100vh to fill the viewport
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Router>
          <Navbar />
          <Box sx={{ flex: 1 }}> {/* This Box takes the available space */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <SignIn />} />
              <Route path="/course/:id" element={isLoggedIn ? <CourseDetail /> : <SignIn />} />
              <Route path="/course/:courseId/level/:levelId" element={isLoggedIn ? <LevelDetail /> : <SignIn />} />
            </Routes>
          </Box>
        </Router>
        <Footer/>
      </Box>
    </ThemeProvider>
  );
};

export default App;

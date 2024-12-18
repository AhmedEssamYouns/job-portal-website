import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { useThemeContext } from './context/ThemeContext';
import Navbar from './shared/Navbar/Navbar';
import HomePage from './pages/home/HomePage';
import theme from './styles/theme';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import { checkLogin } from './services/users';
import CourseDetail from './pages/course/CourseDetail';
import LevelDetail from './pages/course/LevelDetail';
import Footer from './shared/Fotter/Fotter';
import CoursesPage from './pages/course/CoursePage';
import UserProfile from './pages/profile/Profile';
import ScrollToTop from './utils/scrolltotop';
import SearchResultsPage from './pages/course/SearchResultsPage';
import AdminPanal from './pages/admin/admin';
import AddCoursePage from './pages/admin/addCourse';
import { useCheckLogin } from './hooks/useAuth';

const queryClient = new QueryClient(); 

const App = () => {
  const { themeMode } = useThemeContext();
  const isLoggedIn = useCheckLogin();

  return (
    <QueryClientProvider client={queryClient}> 
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
            <ScrollToTop />
            <Navbar/>
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPanal />} />
                <Route path="/admin/addCourse" element={<AddCoursePage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <SignIn />} />
                <Route path="/course/:id" element={isLoggedIn ? <CourseDetail /> : <SignIn />} />
                <Route
                  path="/course/:courseId/level/:levelId"
                  element={isLoggedIn ? <LevelDetail /> : <SignIn />}
                />
              </Routes>
            </Box>
          </Router>
          <Footer />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

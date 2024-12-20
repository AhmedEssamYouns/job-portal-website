import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./redux/store";
import { useThemeContext } from "./context/ThemeContext";
import Navbar from "./shared/Navbar/Navbar";
import HomePage from "./pages/home/HomePage";
import theme from "./styles/theme";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import CourseDetail from "./pages/course/CourseDetail";
import LevelDetail from "./pages/course/LevelDetail";
import Footer from "./shared/Fotter/Fotter";
import CoursesPage from "./pages/course/CoursePage";
import UserProfile from "./pages/profile/Profile";
import ScrollToTop from "./utils/scrolltotop";
import SearchResultsPage from "./pages/course/SearchResultsPage";
import AdminPanal from "./pages/admin/admin";
import AddCoursePage from "./pages/admin/addCourse";
import { useCheckLogin } from "./hooks/useAuth";
import { fetchUserById } from "./services/users";
import HourglassLoader from "./shared/Loaders/Components/Hamster";


const queryClient = new QueryClient();

const App = () => {
  const { themeMode } = useThemeContext();
  const isLoggedIn = useCheckLogin();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userId = isLoggedIn.id;
        if (userId) {
          const userData = await fetchUserById(userId);
          setIsAdmin(userData?.isAdmin || false); // Set admin status
        }
      } catch (error) {
        console.error("Error verifying admin status:", error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    checkAdminStatus();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: theme[themeMode].palette.background.default,
        }}
      >
        <HourglassLoader />
      </Box>
    );

  return (

    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme[themeMode]}>
          <CssBaseline />
          <Box
            sx={{
              backgroundColor: theme[themeMode].palette.background.default,
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Router>
              <ScrollToTop />
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route
                    path="/profile"
                    element={isLoggedIn ? <UserProfile /> : <SignIn />}
                  />
                  <Route
                    path="/course/:id"
                    element={isLoggedIn ? <CourseDetail /> : <SignIn />}
                  />
                  <Route
                    path="/course/:courseId/level/:levelId"
                    element={isLoggedIn ? <LevelDetail /> : <SignIn />}
                  />
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      isAdmin ? <AdminPanal /> : <Navigate to="/signin" />
                    }
                  />
                  <Route
                    path="/admin/addCourse"
                    element={
                      isAdmin ? <AddCoursePage /> : <Navigate to="/signin" />
                    }
                  />
                </Routes>
              </Box>
            </Router>
            <Footer />
          </Box>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>

  );
};

export default App;

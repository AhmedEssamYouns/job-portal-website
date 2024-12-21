import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useFetchUserById } from "../../hooks/useAuth"; // Assuming this is your hook
import { useFetchCourses } from "../../hooks/useCourses"; // Assuming this is your hook
import { removeCourseFromWishlist } from "../../services/courses"; // Assuming this is your API call
import { checkLogin } from "../../services/users";
import HourglassLoader from "../../shared/Loaders/Components/Hamster";
import CourseCard from "../../shared/Course/client/CourseCard";

const WishList = () => {
  const userId = checkLogin().id;

  // Fetch user and course data
  const { data: user, isLoading: userLoading } = useFetchUserById(userId);
  const { data: courses, isLoading: coursesLoading } = useFetchCourses();

  // Add state for managing the wishlist
  const [wishlist, setWishlist] = useState([]);

  // Filter courses to match user enrolled courses (course._id should match user.enrolledCourses)

  const handleRemoveItem = async (courseId) => {
    try {
      // Remove course from wishlist via API
      await removeCourseFromWishlist(userId, courseId);

      // Update local wishlist state by removing the course with the matching ID
      const updatedWishlist = wishlist.filter(
        (course) => course._id !== courseId
      );

      // Set the updated wishlist state
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error removing course from wishlist:", error);
    }
  };

  // Wait for the user and courses data to be loaded before rendering
  useEffect(() => {
    if (user && courses) {
      // Initialize wishlist with courses that the user has in their wishlist
      const initialWishlist = courses.filter((course) =>
        user.wishlistCourses.includes(course._id)
      );
      setWishlist(initialWishlist);
    }
  }, [user, courses]);

  // If user data or courses are still loading
  if (userLoading || coursesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <HourglassLoader />
      </Box>
    );
  }

  // If user is not logged in or no wishlist courses, show appropriate message
  if (!wishlist || wishlist.length === 0) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Wishlist
        </Typography>
        <Typography>No items in wishlist.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Wishlist
      </Typography>
      <List>
        {wishlist.length === 0 ? (
          <Typography>No enrolled courses in wishlist.</Typography>
        ) : (
          wishlist.map((course) => (
            <Box>
              <CourseCard
                course={course}
                onRemove={handleRemoveItem}
                showRemoveButton={true}
              />
            </Box>
          ))
        )}
      </List>
    </Box>
  );
};

export default WishList;

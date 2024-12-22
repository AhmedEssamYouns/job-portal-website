import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { useFetchUserById } from "../../hooks/useAuth";
import { useFetchCourses } from "../../hooks/useCourses";
import { removeCourseFromWishlist } from "../../services/courses";
import { checkLogin } from "../../services/users";
import HourglassLoader from "../../shared/Loaders/Components/Hamster";
import CourseCard from "../../shared/Course/client/CourseCard";
import CoursesList from "../../shared/Course/client/CoursesList";

const WishList = () => {
  const userId = checkLogin().id;

  const { data: user, isLoading: userLoading } = useFetchUserById(userId);
  const { data: courses, isLoading: coursesLoading } = useFetchCourses();

  const [wishlist, setWishlist] = useState([]);

  const handleRemoveItem = async (courseId) => {
    try {
      await removeCourseFromWishlist(userId, courseId);
      const updatedWishlist = wishlist.filter(
        (course) => course._id !== courseId
      );
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error removing course from wishlist:", error);
    }
  };

  useEffect(() => {
    if (user && courses) {
      const initialWishlist = courses.filter((course) =>
        user.wishlistCourses.includes(course._id)
      );
      setWishlist(initialWishlist);
    }
  }, [user, courses]);

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
    <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
     <CoursesList fetchType="wishlist" onRemove={handleRemoveItem} showprice={true} />
     </Container>
  );
};

export default WishList;

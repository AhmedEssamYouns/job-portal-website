import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchCourseById } from "../../hooks/useCourses";
import { useFetchUserById } from "../../hooks/useAuth";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassLoader from "../../shared/Loaders/Components/Hamster";
import { checkLogin } from "../../services/users";
import CommentsSection from "./components/comments";
import Rating from "@mui/material/Rating"; // Import Rating component
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import { blue, green, pink } from "@mui/material/colors";
import RobotHi from "../../assets/svgs/RobotHi.svg";

const CourseDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const CurrentUser = checkLogin();

  const { data: course, isLoading, isError, error } = useFetchCourseById(id);
  const { data: user, isLoading: userLoading } = useFetchUserById(
    CurrentUser?.id
  );

  const isLevelCompletedByUser = (level) => {
    return level.completedByUsers.some(
      (user) => user.userId === CurrentUser.id
    );
  };

  useEffect(() => {
    if (course && course.comments) {
      const newRating = calculateAverageRating(course.comments);
      setUpdatedRating(newRating);
    }
  }, [course]);
  const allPreviousLevelsCompleted = (index) => {
    return course?.levels
      .slice(0, index)
      .every((level) => isLevelCompletedByUser(level));
  };

  const [updatedRating, setUpdatedRating] = useState(course?.rating || 0);

  const [isEnrolled, setIsEnrolled] = useState(false); // Static state for enrollment
  const [isInWishlist, setIsInWishlist] = useState(false); // Static state for wishlist
  const handleEnrollClick = () => {
    setIsEnrolled(true);
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(true);
  };

  const handleBuyNowClick = () => {
    alert("Redirecting to payment gateway...");
  };
  const calculateAverageRating = (comments) => {
    if (!comments || comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (acc, comment) => acc + comment.rating,
      0
    );
    return totalRating / comments.length;
  };

  const handleRatingUpdate = (updatedComments) => {
    const newRating = calculateAverageRating(updatedComments);
    setUpdatedRating(newRating); // Update the parent component's rating state
  };

  if (isLoading || userLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <HourglassLoader />
      </Box>
    );
  }

  if (isError || !course) {
    return (
      <Typography color="error">
        Error: {error?.message || "Unable to fetch course data"}
      </Typography>
    );
  }

  const isCourseCompleted = user?.completedCourses.includes(course?._id);

  return (
    <Box sx={{ padding: 4, backgroundColor: theme.palette.background.default }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
      >
        {course.title}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Description:
      </Typography>
      <Box
      
        sx={{
          position: "absolute",
          right: "0px",
          top: "80px",
          "@media (max-width: 600px)": {
            top: "120px",
          },
        }}
      >
        <img
          src={RobotHi}
          alt="Robot Hi"
          style={{ width: "180px", height: "250px" }} // Adjust size as needed
        />
      </Box>

      <Typography
        zIndex={3000} // Ensure text is above the image
        variant="body1"
        width={"70%"}
        paragraph
        sx={{ color: theme.palette.text.secondary }}
      >
        {course.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Language:
      </Typography>
      <Typography
        variant="body1"
        paragraph
        sx={{ color: theme.palette.text.secondary }}
      >
        {course.language}
      </Typography>

      {/* Pricing Section */}
      {course.price > 0 && (
        <Box
          sx={{
            padding: 2,
            marginBottom: 4,
            border: `2px solid ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: { sm: "space-between" },
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              textAlign: { xs: "center", sm: "left" }, // Center align on mobile
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
            }}
          >
            Price: ${course.price}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stacks buttons on mobile
              gap: 2,
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-end" }, // Center on mobile
              width: "100%", // Ensures buttons take full width on mobile
            }}
          >
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              sx={{
                height: 55,

                backgroundColor: '#e91e63',
                color: 'white',
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
                width: { xs: "100%", sm: "auto" }, // Full width on mobile
              }}
              onClick={handleBuyNowClick}
            >
              Buy Now
            </Button>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "row" }, // Row on all screen sizes
                gap: 2, // Add spacing between buttons
                alignItems: "stretch", // Ensure buttons have the same height
              }}
            >
              {!isEnrolled ? (
                <Button
                
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  sx={{
                    height: 55,
                    backgroundColor: blue[500],
                    color: theme.palette.common.white,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    flex: { xs: 1, sm: "none" }, // Take equal space on mobile
                  }}
                  onClick={handleEnrollClick}
                >
                  Enroll Now
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    backgroundColor: green[500],
                    color: theme.palette.common.white,
                    "&:hover": {
                      backgroundColor: green[700],
                    },
                    flex: { xs: 1, sm: "none" },
                    height: 55,
                  }}
                >
                  Go to Cart
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<FavoriteIcon />}
                sx={{
                  borderColor: isInWishlist ? pink[500] : theme.palette.divider,
                  color: isInWishlist ? pink[500] : theme.palette.text.primary,
                  "&:hover": {
                    borderColor: pink[700],
                    color: pink[700],
                  },
                  flex: { xs: 1, sm: "none" },
                  height: 55,
                }}
                onClick={handleAddToWishlist}
              >
                {isInWishlist ? "Wishlisted" : "Add Wishlist"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Display course completion status */}
      {isCourseCompleted && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Typography
            variant="body1"
            sx={{ color: green[500], fontWeight: "bold", mr: 1 }}
          >
            Course Completed
          </Typography>
          <CheckCircleIcon sx={{ color: green[500] }} />
        </Box>
      )}

      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 4, fontWeight: "bold" }}
      >
        Levels
      </Typography>
      <Grid
        container
        spacing={2}
        pb={5}
        borderBottom={1}
        mb={2}
        borderColor={theme.palette.divider}
      >
        {course.levels.map((level, index) => (
          <Grid item xs={12} sm={6} md={4} key={level._id}>
            <Link
              to={
                allPreviousLevelsCompleted(index) ||
                isLevelCompletedByUser(level)
                  ? `/course/${id}/level/${level._id}`
                  : "#"
              }
              style={{
                textDecoration: "none",
                pointerEvents:
                  allPreviousLevelsCompleted(index) ||
                  isLevelCompletedByUser(level)
                    ? "auto"
                    : "none",
                opacity:
                  allPreviousLevelsCompleted(index) ||
                  isLevelCompletedByUser(level)
                    ? 1
                    : 0.5,
              }}
              onClick={(e) => {
                if (
                  !(
                    allPreviousLevelsCompleted(index) ||
                    isLevelCompletedByUser(level)
                  )
                ) {
                  e.preventDefault();
                  alert("You must complete all previous levels first!");
                  return;
                }
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  paddingBottom: 2,
                  flexDirection: "column",
                  position: "relative",
                  ":hover": { boxShadow: 6 },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {level.title}
                  </Typography>
                </CardContent>

                {isLevelCompletedByUser(level) && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: theme.palette.background.paper,
                      padding: "2px 4px",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: green[500],
                        fontSize: "0.875rem",
                        mr: 0.5,
                      }}
                    >
                      Completed
                    </Typography>
                    <CheckCircleIcon
                      sx={{
                        fontSize: 20,
                        color: green[500],
                      }}
                    />
                  </Box>
                )}
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Display the course rating as stars */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 2,
        }}
      >
        <Rating
          name="course-rating"
          value={updatedRating} // Use the updated rating
          readOnly
          precision={0.5}
          sx={{ fontSize: 48 }}
        />
      </Box>

      {/* Comments Section */}
      <CommentsSection
        currentUserId={CurrentUser?.id}
        courseId={id}
        comments={course.comments}
        onUpdateRating={handleRatingUpdate} // Pass the rating update handler
      />
    </Box>
  );
};

export default CourseDetail;

import React, { useState } from "react";
import CourseCard from "./CourseCard";
import {
  Grid,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  useFetchCourses,
  useFetchCoursesWithCompletionStatus,
  useFetchIncompletedCourses,
} from "../../../hooks/useCourses";
import { useNavigate } from "react-router-dom";
import HourglassLoader from "../../Loaders/Components/Hamster";
import { checkLogin } from "../../../services/users";
import { useFetchUserById } from "../../../hooks/useAuth";

const CoursesList = ({
  fetchType,
  onRemove,
  withFilter = false,
  withSort = false,
  showprice = false,
  showPlaceholder = false,
}) => {
  const navigate = useNavigate();
  const user = checkLogin();
  const [refetch, setRefetch] = useState(false);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userFetchError,
  } = useFetchUserById(user?.id, { refetchInterval: refetch ? 0 : null });

  const handleRemove = (courseId) => {
    if (onRemove) {
      onRemove(courseId);
      setRefetch((prev) => !prev); // Toggle refetch state
    }
  };
  // Fetch data from hooks
  const {
    data: completedCourses = [],
    isLoading: isLoadingCompleted,
    isError: isErrorCompleted,
    error: errorCompleted,
  } = useFetchCoursesWithCompletionStatus();

  const {
    data: incompletedCourses = [],
    isLoading: isLoadingIncompleted,
    isError: isErrorIncompleted,
    error: errorIncompleted,
  } = useFetchIncompletedCourses(user?.id);

  const {
    data: allCourses = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useFetchCourses();

  // Initialize variables
  let courses = [];
  let isLoading = false;
  let isError = false;
  let error = null;

  // Determine data based on fetchType
  switch (fetchType) {
    case "completed":
      courses = completedCourses;
      isLoading = isLoadingCompleted;
      isError = isErrorCompleted;
      error = errorCompleted;
      break;
    case "incompleted":
      courses = incompletedCourses;
      isLoading = isLoadingIncompleted;
      isError = isErrorIncompleted;
      error = errorIncompleted;
      break;
    case "enrolled":
      courses = allCourses.filter((course) =>
        userData?.enrolledCourses?.includes(course._id)
      );
      isLoading = isLoadingAll || userLoading;
      isError = isErrorAll || userError;
      error = errorAll || userFetchError;
      break;
    case "wishlist":
      courses = allCourses.filter((course) =>
        userData?.wishlistCourses?.includes(course._id)
      );
      isLoading = isLoadingAll || userLoading;
      isError = isErrorAll || userError;
      error = errorAll || userFetchError;

      break;
    default:
      courses = allCourses;
      isLoading = isLoadingAll;
      isError = isErrorAll;
      error = errorAll;
  }

  // State for filter, sort, and custom price range
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");
  // Apply filter
  if (withFilter) {
    courses = courses.filter((course) => {
      if (filter === "free") return course.price === 0;
      if (filter === "premium") return course.price > 0;
      return true; // 'all'
    });

    // Apply custom price range filter
    if (minPrice || maxPrice) {
      courses = courses.filter((course) => {
        const price = course.price;
        return (
          (minPrice ? price >= parseFloat(minPrice) : true) &&
          (maxPrice ? price <= parseFloat(maxPrice) : true)
        );
      });
    }
  }

  // Apply sort
  if (withSort) {
    courses = courses.sort((a, b) => {
      if (sort === "low-to-high") return a.price - b.price;
      if (sort === "high-to-low") return b.price - a.price;
      return 0; // 'none'
    });
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "100px",
        }}
      >
        <HourglassLoader />
      </Box>
    );
  }

  // Handle errors
  if (isError) {
    console.error("Error loading courses:", error);
    return (
      <Box textAlign="center" sx={{ marginTop: 4 }}>
        <Typography color="error" gutterBottom>
          Failed to load courses. Please try again later.
        </Typography>
        {error?.message && (
          <Typography color="error">{error.message}</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {withFilter && isMobile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            color="primary"
            onClick={() => setDrawerOpen(true)}
            size={isMobile ? "large" : "medium"}
          >
            <Typography variant="body1">Filter Courses </Typography>
            <FilterListIcon />
          </IconButton>
        </Box>
      )}
      <Drawer
        anchor={isMobile ? "bottom" : "left"}
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? "20px 20px 0 0" : "0 20px 20px 0",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : 250,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {withFilter && isMobile && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filter"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </Select>
            </FormControl>
          )}
          {withSort && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="low-to-high">Price: Low to High</MenuItem>
                <MenuItem value="high-to-low">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          )}
          {withFilter && (
            <>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                margin="normal"
              />
            </>
          )}
        </Box>
      </Drawer>

      {(withFilter || withSort) && !isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {withFilter && (
              <FormControl variant="outlined" sx={{ width: "130px" }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Filter"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
            )}
            {withSort && (
              <FormControl variant="outlined" sx={{ width: "130px" }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low-to-high">Price: Low to High</MenuItem>
                  <MenuItem value="high-to-low">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
          {withFilter && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <TextField
                sx={{ width: "130px" }}
                label="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <TextField
                sx={{ width: "130px" }}
                label="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Box>
          )}
        </Box>
      )}
      {(filter !== "all" || minPrice || maxPrice) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            p: 2,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          <Typography variant="body1" color="primary">
            Filter Applied:{" "}
            {filter !== "all" && filter !== "none"
              ? filter.charAt(0).toUpperCase() + filter.slice(1)
              : ""}
            {minPrice && ` | Min Price: ${minPrice}`}
            {maxPrice && ` | Max Price: ${maxPrice}`}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => {
              setFilter("all");
              setMinPrice("");
              setMaxPrice("");
            }}
          >
            Tab to Remove
          </Button>
        </Box>
      )}

      {fetchType && filter === "all" && courses.length > 0 && (
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ marginTop: 2 }}
        >
          {fetchType === "completed" && "Completed Courses"}
          {fetchType === "incompleted" && "Current Learning Courses"}
          {fetchType === "enrolled" && "Enrolled Courses"}
          {fetchType === "wishlist" && "My Wishlist"}
        </Typography>
      )}

      {courses.length === 0 ? (
        <Box textAlign="center" sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            {fetchType === "enrolled" && (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontWeight: "bold",
                    mt: 2,
                    mb: 4,
                  }}
                >
                  No Enrolled Courses Yet!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/courses")}
                  sx={{
                    animation: "bounce 1.5s infinite",
                    "@keyframes bounce": {
                      "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                      "40%": { transform: "translateY(-10px)" },
                      "60%": { transform: "translateY(-5px)" },
                    },
                    mt: 2,
                    px: 3,
                    py: 1,
                    borderRadius: "20px",
                    fontWeight: "bold",
                    boxShadow: (theme) => theme.shadows[4],
                  }}
                >
                  Browse Courses
                </Button>
                {showPlaceholder && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <img
                      src={require("../../../assets/imgs/image.png")}
                      alt="Placeholder"
                      style={{ width: "300px" }}
                    />
                  </div>
                )}
              </>
            )}
            {fetchType === "wishlist" && "Your Wishlist is Empty!"}
          </Typography>
          {fetchType === "incompleted" && (
            <>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  fontWeight: "bold",
                  mt: 2,
                  mb: 4,
                }}
              >
                You have no active courses.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/courses")}
                sx={{
                  animation: "bounce 1.5s infinite",
                  "@keyframes bounce": {
                    "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                    "40%": { transform: "translateY(-10px)" },
                    "60%": { transform: "translateY(-5px)" },
                  },
                  mt: 2,
                  px: 3,
                  py: 1,
                  borderRadius: "20px",
                  fontWeight: "bold",
                  boxShadow: (theme) => theme.shadows[4],
                }}
              >
                Browse Courses
              </Button>
              {showPlaceholder && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <img
                    src={require("../../../assets/imgs/image.png")}
                    alt="Placeholder"
                    style={{ width: "300px" }}
                  />
                </div>
              )}
            </>
          )}
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ paddingBottom: "20px", marginTop: 2, justifyContent: "center" }}
        >
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <CourseCard
                showprice={showprice}
                showRemoveButton={onRemove}
                onRemove={handleRemove}
                course={course}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CoursesList;

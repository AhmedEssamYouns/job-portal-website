import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  LinearProgress,
  Snackbar,
  useTheme,
  IconButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkLogin, fetchUserById } from "../../../services/users";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { fetchCourseById } from "../../../services/courses";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiRuby,
  SiPhp,
  SiCsharp,
  SiSwift,
  SiTypescript,
  SiKotlin,
} from "react-icons/si";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the Delete Icon

const languageIcons = {
  javascript: { icon: <SiJavascript />, color: "#F7DF1E" },
  python: { icon: <SiPython />, color: "#306998" },
  cpp: { icon: <SiCplusplus />, color: "#00599C" },
  ruby: { icon: <SiRuby />, color: "#CC342D" },
  html: { icon: <SiHtml5 />, color: "#E44D26" },
  css: { icon: <SiCss3 />, color: "#1572B6" },
  php: { icon: <SiPhp />, color: "#8993BE" },
  csharp: { icon: <SiCsharp />, color: "#239120" },
  swift: { icon: <SiSwift />, color: "#F05138" },
  typescript: { icon: <SiTypescript />, color: "#007ACC" },
  kotlin: { icon: <SiKotlin />, color: "#F18E33" },
};

const placeholderIconUrl =
  "https://assets.xcelpros.com/wp-content/uploads/2023/04/28141538/icm-icon-code.png";

const CourseCard = ({
  course,
  showRemoveButton = false,
  onRemove,
  showprice = false,
}) => {
  const [user, setUser] = useState(null);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [totalLevels, setTotalLevels] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = checkLogin();
      if (currentUser) {
        try {
          const userData = await fetchUserById(currentUser.id);
          setUser(userData);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadCourseLevels = async () => {
      try {
        const courseData = await fetchCourseById(course._id);
        if (courseData.levels) {
          setTotalLevels(courseData.levels.length);
          const completedLevels = courseData.levels.filter((level) =>
            level.completedByUsers.some(
              (completedUser) => completedUser.userId === user?._id
            )
          ).length;
          setLevelsCompleted(completedLevels);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      loadCourseLevels();
    }
  }, [user, course._id]);

  const isCourseCompleted = user?.completedCourses.includes(course._id);

  const handleCardClick = () => {
    if (loading) return;
    if (!user) {
      setOpenSnackbar(true);
    } else {
      navigate(`/course/${course._id}`);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Placeholder Card Component
  const PlaceholderCard = () => (
    <Card
      sx={{
        height: "265px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: 3,
        borderRadius: 2,
        cursor: "not-allowed",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", opacity: 0.5 }}
        >
          Loading...
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, opacity: 0.5 }}
        >
          Please wait while we load the course details.
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ marginBottom: 15 }}>
      {loading ? (
        <PlaceholderCard />
      ) : (
        <Card
          sx={{
            width: "100%",
            maxWidth: "400px",
            height: "265px",
            display: "flex",
            marginTop: "10px",
            flexDirection: "column",
            position: "relative",
            boxShadow: 3,
            borderRadius: 2,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            overflow: "visible",
          }}
          onClick={handleCardClick}
        >
          {isCourseCompleted && (
            <MilitaryTechIcon
              style={{
                position: "absolute",
                top: "-7px",
                right: "0px",
                color: theme.palette.mode === "light" ? "black" : "whitesmoke",
                width: "60px",
                height: "auto",
              }}
            />
          )}
          {/* Language Icon and Title Row inside CardContent */}
          <CardContent sx={{ flexGrow: 1, paddingTop: "2px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: "5px",
              }}
            >
              {languageIcons[course.language.toLowerCase()] ? (
                <Box
                  sx={{
                    color: languageIcons[course.language.toLowerCase()].color,
                    fontSize: "2.5rem",
                    marginRight: "10px",
                    marginTop: "5px",
                  }}
                >
                  {languageIcons[course.language.toLowerCase()].icon}
                </Box>
              ) : (
                <img
                  src={placeholderIconUrl}
                  alt="Programming Icon"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    marginRight: "10px",
                  }}
                />
              )}
              <Typography
                variant="h7"
                component="div"
                width={"200px"}
                sx={{ fontWeight: "bold" }}
              >
                {course.title}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 0,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                textOverflow: "ellipsis",
              }}
            >
              {course.description}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Language:</strong> {course.language}
            </Typography>
            {course.price > 0 && (
              <Box
                sx={{
                  width: "fit-content",
                  mt: "5px",
                  background: "gold",
                  color: "black",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  textTransform: "uppercase",
                }}
              >
                Premium
              </Box>
            )}
            {showprice && course.price > 0 && (
              <Typography pt="5px" variant="body2" color="text.secondary">
                <strong>Price:</strong> ${course.price}
              </Typography>
            )}
          </CardContent>
          <CardActions
            sx={{
              pb: "5px",
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {levelsCompleted > 0 && (
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign={{ xs: "center", md: "left" }}
                >
                  Progress: {levelsCompleted} of {totalLevels} levels completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(levelsCompleted / totalLevels) * 100}
                  sx={{ height: 10, borderRadius: 5, mt: 1 }}
                />
              </Box>
            )}

            {isCourseCompleted && (
              <Box
                sx={{
                  display: "flex",
                  alignSelf: "flex-end",
                  alignItems: "center",
                  padding: "1px 3px",
                  background:
                    theme.palette.mode === "light"
                      ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                      : "linear-gradient(135deg, #0d47a1, #1565c0)",
                  borderRadius: 1,
                  marginTop: { xs: 1, md: 0 },
                  width: "auto",
                }}
              >
                <Typography
                  variant="body2"
                  color="white"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  Completed
                </Typography>
                <CheckCircleIcon
                  sx={{
                    color: "white",
                    marginLeft: 0.5,
                    fontSize: { xs: "16px", md: "20px" },
                  }}
                />
              </Box>
            )}
          </CardActions>
        </Card>
      )}
      {showRemoveButton && onRemove && (
        <Button
          variant="contained"
          color="error"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
            padding: "8px 16px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
          onClick={() => onRemove(course._id)} // Handle remove action on button click
        >
          <DeleteIcon sx={{ marginRight: "8px", color: "white" }} />
          <Typography variant="button" sx={{ color: "white" }}>
            Remove
          </Typography>
        </Button>
      )}
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message="Access denied. You need to sign in first."
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            backgroundColor: "#f44336",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      />
    </div>
  );
};

export default CourseCard;

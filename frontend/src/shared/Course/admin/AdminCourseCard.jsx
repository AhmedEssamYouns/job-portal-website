import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  IconButton,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { editCourse } from "../../../services/courses";
import { useNavigate } from "react-router-dom";
import ImageIcon from "../../../assets/imgs/image.png";
import { Image } from "@mui/icons-material";
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

const AdminCourseCard = ({ course, onEdit, onDelete, onUpdateCourse }) => {
  const theme = useTheme();

  // State for Dialog/Form
  const [open, setOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    title: course.title,
    description: course.description,
    language: course.language,
    price: course.price,
  });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDeleteClick = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmation) {
      onDelete(course._id); // Call the onDelete function passed as prop
    } else {
      console.log("Course deletion cancelled");
    }
  };

  const handleEditClick = () => {
    setOpen(true); // Open the dialog when clicking edit
  };

  const handleCloseDialog = () => {
    setOpen(false); // Close the dialog without saving
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // Update the course via API call
      await editCourse(course._id, courseData);
      onUpdateCourse(course._id, courseData);
      setSnackbarMessage("Course updated successfully!");
      setSnackbarOpen(true);
      setOpen(false); // Close the dialog after saving
    } catch (error) {
      console.error("Error updating course:", error);
      setSnackbarMessage("Error updating course");
      setSnackbarOpen(true);
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth: "400px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: 3,
          borderRadius: 2,
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          overflow: "visible",
          marginBottom: 2,
        }}
      >
        <CardContent sx={{ flexGrow: 1, paddingTop: "5px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: "10px",
            }}
          >
            {languageIcons[course.language.toLowerCase()] ? (
              <Box
                sx={{
                  color: languageIcons[course.language.toLowerCase()].color,
                  fontSize: "1.8rem", // Smaller icon size
                  marginRight: "10px",
                }}
              >
                {languageIcons[course.language.toLowerCase()].icon}
              </Box>
            ) : (
              <img
                src={placeholderIconUrl}
                alt="Programming Icon"
                style={{
                  width: "1.8rem",
                  height: "1.8rem",
                  marginRight: "10px",
                }} // Adjusted size
              />
            )}
            <Typography
              variant="h8"
              component="div"
              width={"200px"}
              sx={{ fontWeight: "bold" }}
            >
              {course.title}
            </Typography>
            <CardActions
              sx={{
                justifyContent: "flex-end",
                background: theme.palette.action.focus,
                marginLeft: 1,
                borderRadius: 20,
              }}
            >
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeleteClick} color="error">
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 3, // Limits to 3 lines
              textOverflow: "ellipsis", // Add ellipsis
            }}
          >
            {course.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Language:</strong> {course.language}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>price:</strong> {course.price}
          </Typography>
          <Button
            sx={{ position: "absolute", bottom: 5, right: 5 }}
            variant="contained"
            onClick={() => navigate(`/course/${course._id}`)}
          >
            View Course
          </Button>
        </CardContent>
      </Card>

      {/* Dialog for Editing Course */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <img
            src={ImageIcon}
            alt="Course Image"
            style={{
              width: "150px",
              margin: "0 auto", 
              display: "block", 
            }}
          />

          <TextField
            fullWidth
            label="Title"
            name="title"
            value={courseData.title}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Language"
            name="language"
            value={courseData.language}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={courseData.price}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for displaying success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminCourseCard;

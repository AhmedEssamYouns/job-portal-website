import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  TextField,
  Box,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Rating,
} from "@mui/material";
import {
  ExpandMore,
  Edit,
  Delete,
  Save,
  FormatBold,
  FormatItalic,
  Link,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
const CommentsSection = ({ currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      userId: 1,
      img: "user1.jpg",
      name: "John Doe",
      comment: "Great course! Learned a lot.",
      rating: 4, // Add the rating here
      date: "2024-12-18",
    },
    {
      id: 2,
      userId: 2,
      img: "user2.jpg",
      name: "Jane Smith",
      comment: "Very informative. Highly recommended!",
      rating: 5, // Add the rating here
      date: "2024-12-17",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0); // State for edited rating
  const [alertOpen, setAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [newRating, setNewRating] = useState(0); // State for new rating
  const theme = useTheme();

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentData = {
        comment: newComment,
        rating: newRating,
        userId: currentUserId,
        name: "User Name", // Replace with actual user name
        img: "", // User avatar URL can go here
        date: new Date().toLocaleDateString(),
      };
      setComments([...comments, newCommentData]);
      setNewComment("");
      setNewRating(0); // Reset the rating after comment is added
    }
  };

  const handleEditComment = (index) => {
    setEditingIndex(index);
    setEditedComment(comments[index].comment);
    setEditedRating(comments[index].rating); // Set the current rating for editing
  };

  const handleSaveEdit = (index) => {
    const updatedComments = [...comments];
    updatedComments[index].comment = editedComment;
    updatedComments[index].rating = editedRating; // Save the edited rating
    setComments(updatedComments);
    setEditingIndex(null);
    setEditedComment("");
    setEditedRating(0); // Reset the edited rating after saving
  };

  const handleDeleteComment = (index) => {
    setCommentToDelete(index);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    const updatedComments = comments.filter(
      (_, index) => index !== commentToDelete
    );
    setComments(updatedComments);
    setAlertOpen(false);
    setSnackBarOpen(true); // Show confirmation snackbar
  };

  const cancelDelete = () => {
    setAlertOpen(false);
  };
  const handleFormatting = (command) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const span = document.createElement("span");
    span.style.fontWeight = command === "bold" ? "bold" : "normal";
    span.style.fontStyle = command === "italic" ? "italic" : "normal";

    range.surroundContents(span); // Wrap selected content with the span element
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ width: "100%", maxWidth: 800 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {expanded ? "Hide Comments" : "Show Comments"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {/* Comment Input */}
            <Box
              border="1px solid #ccc"
              borderRadius={5}
              sx={{
                padding: 2,
                marginBottom: 2,
                width: "100%",
                "&:focus-within": {
                  borderColor: "#3f51b5",
                  boxShadow: "0 0 5px rgba(75, 219, 255, 0.85)",
                },
              }}
            >
              <Box
                sx={{
                  zIndex: 2,
                  right: "35px",
                  display: "flex",
                  alignItems: "center",
                  position: "absolute",
                  marginBottom: 2,
                }}
              >
                <Rating
                  name="comment-rating"
                  value={newRating}
                  onChange={(event, newValue) => setNewRating(newValue)}
                />
              </Box>
              <TextField
                label="Add a comment"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                rows={4}
                variant="standard"
                sx={{
                  marginBottom: 2,
                  input: { borderBottom: "2px solid #ccc" },
                }}
              />

              {/* Toolbar with formatting icons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 1,
                }}
              >
                <Box>
                  <IconButton onClick={() => handleFormatting("bold")}>
                    <FormatBold />
                  </IconButton>
                  <IconButton onClick={() => handleFormatting("italic")}>
                    <FormatItalic />
                  </IconButton>
                  <IconButton onClick={() => handleFormatting("createLink")}>
                    <Link />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{ height: "100%" }}
                >
                  Comment
                </Button>
              </Box>
            </Box>

            {/* Comments List */}

            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                    padding: "10px 20px",
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 2,
                    position: "relative", 
                  }}
                >
                  <Avatar
                    alt={comment.name}
                    src={comment.img}
                    sx={{ marginRight: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
          
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {comment.name}
                      </Typography>
                    {editingIndex !== index && 
                      <Rating
                        value={comment.rating}
                        readOnly
                        sx={{ marginLeft: 1 }}
                      />
                    }
                    </Box>

                    
                    {editingIndex === index ? (
                      <Box>
                        <TextField
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          multiline
                          rows={2}
                          variant="outlined"
                          sx={{ width: "100%", marginTop: 1 }}
                        />
                        <Rating
                          value={editedRating}
                          onChange={(event, newValue) =>
                            setEditedRating(newValue)
                          }
                          sx={{ marginTop: 1 }}
                        />
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {comment.comment}
                      </Typography>
                    )}

                    {/* Display the comment date */}
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.disabled }}
                    >
                      {comment.date}
                    </Typography>
                  </Box>

                  {/* Edit and Delete buttons positioned at the bottom right */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10, // Space from the bottom
                      right: 10, // Space from the right edge
                      display: "flex",
                      gap: 1, // Adds space between the buttons
                    }}
                  >
                    {editingIndex === index ? (
                      <IconButton
                        onClick={() => handleSaveEdit(index)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <Save />
                      </IconButton>
                    ) : (
                      comment.userId === currentUserId && (
                        <>
                          <IconButton
                            onClick={() => handleEditComment(index)}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteComment(index)}
                            sx={{ color: green[500] }}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                }}
              >
                No comments yet.
              </Typography>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Alert for deletion confirmation */}
      <Snackbar
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        autoHideDuration={6000}
      >
        <Alert
          severity="warning"
          action={
            <>
              <Button color="inherit" size="small" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button color="inherit" size="small" onClick={confirmDelete}>
                Confirm
              </Button>
            </>
          }
        >
          Are you sure you want to delete this comment?
        </Alert>
      </Snackbar>

      {/* Snackbar to confirm comment deletion */}
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackBarOpen(false)}
      >
        <Alert severity="success">Comment deleted successfully!</Alert>
      </Snackbar>
    </Box>
  );
};
export default CommentsSection;

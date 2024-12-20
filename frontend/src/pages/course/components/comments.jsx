import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Snackbar,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import CommentInput from "./commentInput";
import CommentItem from "./commentItem";
import { useAddComment, useDeleteComment, useEditComment } from "../../../hooks/useComments";
import { checkLogin, fetchUserById } from "../../../services/users";

const CommentsSection = ({
  currentUserId,
  courseId,
  comments: initialComments,
  onUpdateRating,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [user, setUser] = useState(null);

  const CurrentUser = checkLogin();

  // Sort comments by date in descending order (newer first)
  const sortComments = (comments) => {
    return [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Initialize comments
  useEffect(() => {
    setComments(sortComments(initialComments));
  }, [initialComments]);

  // Fetch user details
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (CurrentUser) {
          const userData = await fetchUserById(CurrentUser.id);
          setUser(userData);

          // Check if there's a stored avatar and name that matches the current user
          const storedAvatar = localStorage.getItem("userAvatar");
          const storedUserName = localStorage.getItem("userName");

          if (storedUserName === userData.username) {
            setUser((prevUser) => ({ ...prevUser, avatar: storedAvatar }));
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    loadUser();
  }, [CurrentUser]);

  // Check if user already commented
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await checkLogin();
        const userHasCommented = comments.some((comment) => comment.userId === loggedInUser.id);
        if (userHasCommented) {
          setAlertMessage("You have commented on this course.");
          setAlertSeverity("info");
          setSnackBarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [comments]);

  // Hooks for API interactions
  const { mutate: addComment } = useAddComment(
    (data) => {
      const updatedComments = sortComments([data.comment, ...comments]);
      setComments(updatedComments);
      onUpdateRating(updatedComments);
      setAlertMessage("Comment added successfully!");
      setAlertSeverity("success");
      setSnackBarOpen(true);
    },
    (error) => {
      console.error("Add comment error:", error.message);
      setAlertMessage(`Error adding comment: ${error.message}`);
      setAlertSeverity("error");
      setSnackBarOpen(true);
    }
  );

  const { mutate: deleteComment } = useDeleteComment(
    () => {
      const updatedComments = sortComments(comments.filter((_, index) => index !== commentToDelete));
      setComments(updatedComments);
      onUpdateRating(updatedComments);
      setAlertMessage("Comment deleted successfully!");
      setAlertSeverity("success");
      setSnackBarOpen(true);
      setAlertOpen(false);
    },
    (error) => {
      console.error("Delete comment error:", error.message);
      setAlertMessage(`Error deleting comment: ${error.message}`);
      setAlertSeverity("error");
      setSnackBarOpen(true);
    }
  );

  const { mutate: editComment } = useEditComment(
    (data) => {
      const updatedComments = sortComments(
        comments.map((comment, index) =>
          index === editingIndex ? data.comment : comment
        )
      );
      setComments(updatedComments);
      onUpdateRating(updatedComments);
      setEditingIndex(null);
      setEditedComment("");
      setEditedRating(0);
      setAlertMessage("Comment edited successfully!");
      setAlertSeverity("success");
      setSnackBarOpen(true);
    },
    (error) => {
      console.error("Edit comment error:", error.message);
      setAlertMessage(`Error editing comment: ${error.message}`);
      setAlertSeverity("error");
      setSnackBarOpen(true);
    }
  );

  const handleAddComment = () => {
    if (!newComment.trim()) {
      setAlertMessage("Comment cannot be empty.");
      setAlertSeverity("error");
      setSnackBarOpen(true);
      return;
    }

    if (user && comments.some((comment) => comment.userId === CurrentUser.id)) {
      setAlertMessage("You have commented on this course.");
      setAlertSeverity("info");
      setSnackBarOpen(true);
      return;
    }

    addComment({
      courseId,
      commentData: {
        comment: newComment,
        rating: newRating,
        userId: currentUserId,
        name: user?.username || "Guest",
      },
    });

    setNewComment("");
    setNewRating(0);
  };

  const handleEditComment = (index) => {
    setEditingIndex(index);
    setEditedComment(comments[index].comment);
    setEditedRating(comments[index].rating);
  };

  const handleSaveEdit = () => {
    editComment({
      courseId,
      commentId: comments[editingIndex]._id,
      updatedCommentData: {
        comment: editedComment,
        rating: editedRating,
      },
    });
  };

  const handleDeleteComment = (index) => {
    setCommentToDelete(index);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteComment({
      courseId,
      commentId: comments[commentToDelete]._id,
    });
  };

  const cancelDelete = () => {
    setAlertOpen(false);
  };

  return (
    <Box sx={{ maxWidth: { xs: "100%", sm: 800 }, margin: "0 auto" }}>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            {expanded
              ? "Hide Comments"
              : `Show ${comments.length > 0 ? comments.length : ""} Comments`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CommentInput
            newComment={newComment}
            setNewComment={setNewComment}
            newRating={newRating}
            setNewRating={setNewRating}
            handleAddComment={handleAddComment}
          />
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <CommentItem
                key={index}
                comment={comment}
                index={index}
                editingIndex={editingIndex}
                editedComment={editedComment}
                setEditedComment={setEditedComment}
                editedRating={editedRating}
                setEditedRating={setEditedRating}
                handleEditComment={handleEditComment}
                handleSaveEdit={handleSaveEdit}
                handleDeleteComment={handleDeleteComment}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No comments yet.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Deletion Confirmation */}
      <Snackbar open={alertOpen} onClose={() => setAlertOpen(false)} autoHideDuration={6000}>
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

      {/* Snackbar for Success or Error */}
      <Snackbar open={snackBarOpen} autoHideDuration={2000} onClose={() => setSnackBarOpen(false)}>
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentsSection;

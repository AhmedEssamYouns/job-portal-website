import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Snackbar, Alert, Button, Box } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import CommentInput from "./commentInput";
import CommentItem from "./commentItem";

const CommentsSection = ({ currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      userId: 1,
      img: "user1.jpg",
      name: "John Doe",
      comment: "Great course! Learned a lot.",
      rating: 4,
      date: "2024-12-18",
    },
    {
      id: 2,
      userId: 2,
      img: "user2.jpg",
      name: "Jane Smith",
      comment: "Very informative. Highly recommended!",
      rating: 5,
      date: "2024-12-17",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentData = {
        comment: newComment,
        rating: newRating,
        userId: currentUserId,
        name: "User Name", // Replace with actual user name
        img: "",
        date: new Date().toLocaleDateString(),
      };
      setComments([newCommentData, ...comments]);
      setNewComment("");
      setNewRating(0);
    }
  };

  const handleEditComment = (index) => {
    setEditingIndex(index);
    setEditedComment(comments[index].comment);
    setEditedRating(comments[index].rating);
  };

  const handleSaveEdit = (index) => {
    const updatedComments = [...comments];
    updatedComments[index].comment = editedComment;
    updatedComments[index].rating = editedRating;
    setComments(updatedComments);
    setEditingIndex(null);
    setEditedComment("");
    setEditedRating(0);
  };

  const handleDeleteComment = (index) => {
    setCommentToDelete(index);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    const updatedComments = comments.filter((_, index) => index !== commentToDelete);
    setComments(updatedComments);
    setAlertOpen(false);
    setSnackBarOpen(true);
  };

  const cancelDelete = () => {
    setAlertOpen(false);
  };

  return (
    <Box sx={{ maxWidth: { xs: "100%", sm: 800 }, margin: "0 auto" }}>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">{expanded ? "Hide Comments" : `Show ${comments.length} Comments`}</Typography>
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

      {/* Snackbar for Successful Deletion */}
      <Snackbar open={snackBarOpen} autoHideDuration={2000} onClose={() => setSnackBarOpen(false)}>
        <Alert severity="success">Comment deleted successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentsSection;

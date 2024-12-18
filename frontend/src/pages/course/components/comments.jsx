import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, TextField, Box, Avatar, IconButton, Alert, Snackbar } from '@mui/material';
import { ExpandMore, Edit, Delete, Save } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const CommentsSection = ({ comments = [], onAddComment, onEditComment, onDeleteComment, currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState(""); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const theme = useTheme();

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleEditComment = (index) => {
    setEditingIndex(index);
    setEditedComment(comments[index].comment);
  };

  const handleSaveEdit = (index) => {
    if (editedComment.trim() !== comments[index].comment) {
      onEditComment(index, editedComment);
    }
    setEditingIndex(null);
    setEditedComment("");
  };

  const handleDeleteComment = (index) => {
    setCommentToDelete(index);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    if (commentToDelete !== null) {
      onDeleteComment(commentToDelete);
      setAlertOpen(false);
      setSnackBarOpen(true);  // Show confirmation snackbar
    }
  };

  const cancelDelete = () => {
    setAlertOpen(false);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
      }}
    >
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ width: '100%', maxWidth: 800 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {expanded ? "Hide Comments" : "Show Comments"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {/* Comment Input */}
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                label="Add a comment"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                rows={4}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                sx={{ width: '100%' }}
              >
                Post Comment
              </Button>
            </Box>

            {/* Comments List */}
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: 2,
                    padding: '10px 20px', 
                    borderRadius: 2, 
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 2 
                  }}
                >
                  <Avatar alt={comment.name} src={comment.img} sx={{ marginRight: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                      {comment.name}
                    </Typography>

                    {/* If editing, show TextField, else show the comment */}
                    {editingIndex === index ? (
                      <TextField
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                        sx={{ width: '100%', marginTop: 1 }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {comment.comment}
                      </Typography>
                    )}

                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                      {comment.date}
                    </Typography>
                  </Box>

                  {/* Edit and Delete buttons */}
                  <Box sx={{ marginLeft: 1 }}>
                    {editingIndex === index ? (
                      <IconButton onClick={() => handleSaveEdit(index)} sx={{ color: theme.palette.primary.main }}>
                        <Save />
                      </IconButton>
                    ) : (
                      comment.userId === currentUserId && (
                        <>
                          <IconButton onClick={() => handleEditComment(index)} sx={{ color: theme.palette.primary.main }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteComment(index)} sx={{ color: green[500] }}>
                            <Delete />
                          </IconButton>
                        </>
                      )
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
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
              <Button color="inherit" size="small" onClick={cancelDelete}>Cancel</Button>
              <Button color="inherit" size="small" onClick={confirmDelete}>Confirm</Button>
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

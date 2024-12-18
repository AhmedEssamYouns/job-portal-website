import React from "react";
import { Box, Typography, Avatar, Rating, IconButton, TextField } from "@mui/material";
import { Edit, Delete, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";

const CommentItem = ({
  comment,
  index,
  editingIndex,
  editedComment,
  setEditedComment,
  editedRating,
  setEditedRating,
  handleEditComment,
  handleSaveEdit,
  handleDeleteComment,
  currentUserId,
}) => {
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: 2,
        padding: "10px 20px",
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 2,
        position: "relative",
      }}
    >
      <Avatar alt={comment.name} src={comment.img} sx={{ marginRight: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {comment.name}
          </Typography>
          {editingIndex !== index && (
            <Rating value={comment.rating} readOnly sx={{ marginLeft: 1 }} />
          )}
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
              onChange={(event, newValue) => setEditedRating(newValue)}
              sx={{ marginTop: 1 }}
            />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {comment.comment}
          </Typography>
        )}

        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          {comment.date}
        </Typography>
      </Box>

      <Box sx={{ position: "absolute", bottom: 10, right: 10, display: "flex", gap: 1 }}>
        {editingIndex === index ? (
          <IconButton onClick={() => handleSaveEdit(index)} sx={{ color: "primary.main" }}>
            <Save />
          </IconButton>
        ) : (
          comment.userId === currentUserId && (
            <>
              <IconButton onClick={() => handleEditComment(index)} sx={{ color: "primary.main" }}>
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
  );
};

export default CommentItem;

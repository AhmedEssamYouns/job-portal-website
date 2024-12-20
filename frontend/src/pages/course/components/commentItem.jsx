import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Rating,
  IconButton,
  TextField,
} from "@mui/material";
import { Edit, Delete, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { format } from "date-fns";

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
  // Check if 'createdAt' is valid
  const isValidCreatedAt =
    comment.createdAt && !isNaN(new Date(comment.createdAt).getTime());
  const formattedCreatedAt = isValidCreatedAt
    ? format(new Date(comment.createdAt), "MMM dd, hh:mm a") // New format
    : "Invalid date";

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
        py:4,
        minHeight: "100px",
        position: "relative",
      }}
    >
      <Avatar alt={comment.name} src={comment.img} sx={{ marginRight: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Box  sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            fontSize={"0.9rem"}
            variant="body1"
            sx={{ fontWeight: "bold" }}
          >
            {comment.name}
          </Typography>
          {editingIndex !== index && (
            <Rating
              size="small"
              value={comment.rating}
              readOnly
              sx={{
                marginLeft: 1,
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            />
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
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", marginBottom: 1 }}
          >
            {comment.comment}
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: 5,
            left: 10,
            color: "text.disabled",
            fontSize: { xs: "0.65rem", sm: "0.875rem" },
          }}
        >
          at: {formattedCreatedAt}
        </Typography>
        {comment.edited && (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 5,
              left: 10,
              color: "text.disabled",
              marginLeft: 1,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Edited
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          display: "flex",
          gap: 1,
        }}
      >
        {editingIndex === index ? (
          <IconButton
            onClick={() => handleSaveEdit(index)}
            sx={{ color: "primary.main" }}
          >
            <Save />
          </IconButton>
        ) : (
          comment.userId === currentUserId && (
            <Box>
              <IconButton
                onClick={() => handleEditComment(index)}
                sx={{ color: "primary.main" }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteComment(index)}
                sx={{ color: green[500] }}
              >
                <Delete />
              </IconButton>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default CommentItem;

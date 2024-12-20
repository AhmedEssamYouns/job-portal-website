import React, { useState } from "react";
import { Box, TextField, IconButton, Button, Rating } from "@mui/material";
import { FormatBold, FormatItalic, Link } from "@mui/icons-material";

const CommentInput = ({ newComment, setNewComment, newRating, setNewRating, handleAddComment }) => {
  const [isFocused, setIsFocused] = useState(false);

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
      border="1px solid #ccc"
      borderRadius={5}
      sx={{
        padding: 2,
        marginBottom: 2,
        transition: "border-color 0.3s", // Smooth transition for the border color change
        borderColor: isFocused ? "#1976d2" : "#ccc", // Change border color on focus
        '&:hover': {
          borderColor: isFocused ? "#1976d2" : "#888", // Change border color when hovering
        },
      }}
    >
      <Box sx={{ zIndex: 2, right: "35px", display: "flex", alignItems: "center", position: "absolute", marginBottom: 2 }}>
        <Rating name="comment-rating" value={newRating} onChange={(event, newValue) => setNewRating(newValue)} />
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
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
          disabled={!newComment.trim()|| !newRating}
          sx={{ height: "100%" }}
        >
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentInput;

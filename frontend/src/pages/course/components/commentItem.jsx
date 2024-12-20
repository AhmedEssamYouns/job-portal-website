import React, { useEffect, useState } from "react";
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
import { getProfileImage } from "../../../services/users";

const DEFAULT_AVATAR =
  "https://th.bing.com/th/id/OIP.XmhhHP-RnTJSSDJsNshpUQHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7";

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
  const [userAvatar, setUserAvatar] = useState(DEFAULT_AVATAR);

  // Fetch user avatar on mount
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const imageUrl = await getProfileImage(comment.userId);
        setUserAvatar(imageUrl);
      } catch (error) {
        console.error("Error fetching user avatar:", error);
        setUserAvatar(DEFAULT_AVATAR);
      }
    };

    fetchAvatar();
  }, [comment.userId]);

  // Format createdAt
  const isValidCreatedAt =
    comment.createdAt && !isNaN(new Date(comment.createdAt).getTime());
  const formattedCreatedAt = isValidCreatedAt
    ? format(new Date(comment.createdAt), "MMM dd, hh:mm a")
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
        py: 4,
        minHeight: "100px",
        position: "relative",
      }}
    >
      <Avatar alt={comment.name} src={userAvatar} sx={{ marginRight: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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

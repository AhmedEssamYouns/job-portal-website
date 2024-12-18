import { useMutation } from '@tanstack/react-query';
import { addCommentToCourse, deleteComment, editComment } from '../services/comments'; // Assuming these are in services/comments.js

// Hook to add a comment to a course
export const useAddComment = (onSuccessCallback, onErrorCallback) => {
  return useMutation({
    mutationFn: ({ courseId, commentData }) => addCommentToCourse(courseId, commentData),
    onSuccess: (data) => {
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};

// Hook to delete a comment from a course
export const useDeleteComment = (onSuccessCallback, onErrorCallback) => {
  return useMutation({
    mutationFn: ({ courseId, commentId }) => deleteComment(courseId, commentId),
    onSuccess: (data) => {
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};

// Hook to edit a comment on a course
export const useEditComment = (onSuccessCallback, onErrorCallback) => {
  return useMutation({
    mutationFn: ({ courseId, commentId, updatedCommentData }) =>
      editComment(courseId, commentId, updatedCommentData),
    onSuccess: (data) => {
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};

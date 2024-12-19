import axios from 'axios';


const BASE_API_URL = 'https://job-portal-website-production.up.railway.app/api';




export const addCommentToCourse = async (courseId, commentData) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/comments`, commentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error.response?.data?.message || error.message);
      throw new Error(error.message);
    }
  };


  // Delete a comment from a course
export const deleteComment = async (courseId, commentId) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/courses/${courseId}/comments/${commentId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data; // The response will confirm the deletion
    } catch (error) {
      console.error('Error deleting comment:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  };
  


  export const editComment = async (courseId, commentId, updatedCommentData) => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}/courses/${courseId}/comments/${commentId}`,
        updatedCommentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data; // The response will contain the updated comment
    } catch (error) {
      console.error('Error editing comment:', error.response?.data?.message || error.message);
      throw new Error(error.message);

    }
  };
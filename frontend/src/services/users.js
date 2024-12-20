import axios from 'axios';

const BASE_API_URL = 'http://localhost:5000/api/';



export const uploadProfileImage = async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      console.error('Payload:', formData);
      const response = await axios.post(
        `${BASE_API_URL}auth/${userId}/profile-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data; // Handle success
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new Error(error);
    }
  };

  export const getProfileImage = async (imageId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}auth/profile-image/${imageId}`, {
        responseType: 'blob', // To handle image files
      });
      return URL.createObjectURL(response.data); // Convert Blob to a usable image URL
    } catch (error) {
      console.error('Error fetching profile image:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile image');
    }
  };


  export const signup = async (userData) => {
    try {
      const response = await axios.post(`${BASE_API_URL}auth/signup`, userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      // Log the error for debugging
      console.error('Signup error:', error.response?.data?.message || error.message);
  
      // Throw the original Axios error to preserve its structure
      throw error;
    }
  };

export const login = async (userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}auth/signin`, userData, {
            headers: { 'Content-Type': 'application/json' },
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        return response.data;
    } catch (error) {
        console.error(`Sign in error: ${error.response?.data?.message}`);
        throw new Error(error.response?.data?.message || 'Sign in failed');
    }
};
export const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}auth/changePassword`, 
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error before password:', error.response || error);  
      if (error.response) {
        throw new Error(error.response.data.message || 'An error occurred.');
      }
      throw new Error('An unknown error occurred.');
    }
  };
  
  
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${BASE_API_URL}auth/forgotPassword`, { email }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data; // You can return the success message or other data
    } catch (error) {
        console.error(`Forgot password error: ${error.response?.data?.message}`);
        throw new Error(error);
    }
};

export const verifyResetCode = async (email, resetCode) => {
    try {
        const response = await axios.post(`${BASE_API_URL}auth/verifyResetCode`, { email, resetCode }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;  // You can return the success message or token here
    } catch (error) {
        console.error(`Verify reset code error: ${error.response?.data?.message}`);
        throw new Error(error.response?.data?.message || 'Verification failed');
    }
};

export const resetPassword = async (newPassword,token) => {
    try {
        if (!token) {
            throw new Error('Reset token is required.');
        }

        const response = await axios.put(`${BASE_API_URL}auth/resetPassword`, { newPassword }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;  // You can return the success message after resetting the password
    } catch (error) {
        console.error(`Reset password error: ${error}`);
        throw new Error(error.response?.data?.message || 'Password reset failed');
    }
};



export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
};

export const checkLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
};

export const fetchUserById = async (userId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}auth/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Fetch user by ID error: ${error.response?.data?.message}`);
        throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
};

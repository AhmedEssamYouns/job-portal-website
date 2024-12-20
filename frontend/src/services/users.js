import axios from 'axios';

const BASE_API_URL = 'https://job-portal-website-production.up.railway.app/api/';





export const signup = async (userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}auth/signup`, userData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Sign up failed');
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
      return response.data; // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error before password:', error.response || error);  // Log the error response from Axios
      if (error.response) {
        // If there's a response from the server, throw the error message from the response
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

import axios from 'axios';
import { refreshAccessToken } from './users';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  response => response, // Return the response if no error
  async error => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retries

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`; // Attach the new token
        return axiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin'; // Redirect to login on failure
        throw refreshError;
      }
    }

    return Promise.reject(error); // Reject other errors
  }
);

export default axiosInstance;

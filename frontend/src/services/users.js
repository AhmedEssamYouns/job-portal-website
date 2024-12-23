import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import axiosInstance from "./interceptor";


const BASE_API_URL =
  "https://job-portal-website-production.up.railway.app/api/";

export const editProfile = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${BASE_API_URL}auth/editUser/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Handle success
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);
    console.error("Payload:", formData);
    const response = await axios.post(
      `${BASE_API_URL}auth/${userId}/profile-image/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Handle success
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw new Error(error);
  }
};

export const getProfileImage = async (imageId) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}auth/profile-image/${imageId}`,
      {
        responseType: "blob", // To handle image files
      }
    );
    return URL.createObjectURL(response.data); // Convert Blob to a usable image URL
  } catch (error) {
    console.error(
      "Error fetching profile image:",
      error.response?.data?.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch profile image"
    );
  }
};

export const useProfileImage = (imageId) => {
  return useQuery({
    queryKey: ["profileImage", imageId],
    queryFn: () => getProfileImage(imageId),
    enabled: !!imageId,
    refetchOnWindowFocus: false,
  });
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token is missing. Please log in again.");
    }

    const response = await axios.post(`${BASE_API_URL}auth/refresh-token`, {
      refreshToken,
    });
    const { token, refreshToken: newRefreshToken } = response.data;

    // Update tokens in localStorage
    localStorage.setItem("token", token);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return token; // Return the new token
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to refresh access token"
    );
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${BASE_API_URL}auth/signup`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error(
      "Signup error:",
      error.response?.data?.message || error.message
    );

    // Throw the original Axios error to preserve its structure
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${BASE_API_URL}auth/signin`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    const { token, refreshToken } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    return response.data;
  } catch (error) {
    console.error(`Sign in error: ${error.response?.data?.message}`);
    throw new Error(error.response?.data?.message || "Sign in failed");
  }
};
export const changePassword = async (currentPassword, newPassword) => {
  try {
    console.log("Attempting to change password...");
    console.log("Request Payload:", { currentPassword, newPassword });
    const token = localStorage.getItem("token");
    console.log("Token Retrieved:", token);

    // Check if token is missing
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    // Make the API request
    const response = await axios.put(
      `${BASE_API_URL}auth/changePassword`,
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("API Response:", response.data); // Log the successful response
    return response.data;
  } catch (error) {
    console.error("Error in changePassword function:");
    if (error.response) {
      // Server responded with a status code outside the range of 2xx
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);

      // Return a more user-friendly error message
      throw new Error(error.response.data.message || "An error occurred.");
    } else if (error.request) {
      // Request was made, but no response received
      console.error("Request Details:", error.request);
      throw new Error("No response from the server. Please try again later.");
    } else {
      // Something else happened while setting up the request
      console.error("Unexpected Error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}auth/forgotPassword`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // You can return the success message or other data
  } catch (error) {
    console.error(`Forgot password error: ${error.response?.data?.message}`);
    throw new Error(error);
  }
};

export const verifyResetCode = async (email, resetCode) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}auth/verifyResetCode`,
      { email, resetCode },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // You can return the success message or token here
  } catch (error) {
    console.error(`Verify reset code error: ${error.response?.data?.message}`);
    throw new Error(error.response?.data?.message || "Verification failed");
  }
};

export const resetPassword = async (newPassword, token) => {
  try {
    if (!token) {
      throw new Error("Reset token is required.");
    }

    const response = await axios.put(
      `${BASE_API_URL}auth/resetPassword`,
      { newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // You can return the success message after resetting the password
  } catch (error) {
    console.error(`Reset password error: ${error}`);
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/signin";
};

export const checkLogin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_API_URL}auth/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Fetch user by ID error: ${error.response?.data?.message}`);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user data"
    );
  }
};

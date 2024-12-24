import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export const editProfile = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`auth/editUser/${userId}`, userData);
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

    const response = await axiosInstance.post(`auth/${userId}/profile-image/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Handle success
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw new Error(error);
  }
};

export const getProfileImage = async (imageId) => {
  try {
    const response = await axiosInstance.get(`auth/profile-image/${imageId}`, {
      responseType: "blob", // To handle image files
    });
    return URL.createObjectURL(response.data);
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

export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post("auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axiosInstance.post("auth/signin", userData);
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
    const response = await axiosInstance.put("auth/changePassword", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("auth/forgotPassword", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data?.message);
    throw error;
  }
};

export const verifyResetCode = async (email, resetCode) => {
  try {
    const response = await axiosInstance.post("auth/verifyResetCode", { email, resetCode });
    return response.data;
  } catch (error) {
    console.error("Verify reset code error:", error.response?.data?.message);
    throw error;
  }
};

export const resetPassword = async (newPassword, token) => {
  try {
    const response = await axiosInstance.put("auth/resetPassword", { newPassword }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
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
    const response = await axiosInstance.get(`auth/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch user by ID error:", error.response?.data?.message);
    throw error;
  }
};

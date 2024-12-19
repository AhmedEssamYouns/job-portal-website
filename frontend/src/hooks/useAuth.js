import { useMutation, useQuery } from '@tanstack/react-query';
import { signup, login, logout, checkLogin, fetchUserById } from '../services/users';

// Hook to sign up a new user
export const useSignup = (onSuccessCallback, onErrorCallback) => {
    return useMutation({
      mutationFn: signup,
      onSuccess: (data) => {
        if (onSuccessCallback) onSuccessCallback(data);

      },
      onError: (error) => {
        if (onErrorCallback) onErrorCallback(error);
      },
    });
  };

// Hook to log in a user
export const useLogin = (onSuccessCallback, onErrorCallback) => {
  return useMutation({
    mutationFn: login, // Function to perform the login request
    onSuccess: (data) => {
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      if (onErrorCallback) onErrorCallback(error);
    },
  });
};


// Hook to fetch user data by ID
export const useFetchUserById = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, // Only fetch when userId is provided
    onError: (error) => {
      console.error('Error fetching user data:', error.message);
    },
  });
};

// Hook to check if the user is logged in
export const useCheckLogin = () => {
  return checkLogin();
};

// Hook to handle logout
export const useLogout = () => {
  return () => logout();
};

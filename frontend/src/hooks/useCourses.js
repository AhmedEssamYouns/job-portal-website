import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCourse,
  fetchCourses,
  fetchCourseById,
  completeLevel,
  completeCourse,
  fetchCoursesWithCompletionStatus,
  fetchIncompletedCourses,
  deleteCourse,
} from '../services/courses';

// Hook to add a course
export const useAddCourse = () => {
  const queryClient = useQueryClient();
  return useMutation(addCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']); // Refresh courses after adding
    },
    onError: (error) => {
      console.error('Error adding course:', error.message);
    },
  });
};

// Hook to fetch all courses
export const useFetchCourses = () => {
  return useQuery(['courses'], fetchCourses, {
    onError: (error) => {
      console.error('Error fetching courses:', error.message);
    },
  });
};

// Hook to fetch course by ID
export const useFetchCourseById = (courseId) => {
  return useQuery(['course', courseId], () => fetchCourseById(courseId), {
    enabled: !!courseId, // Only fetch if courseId is available
    onError: (error) => {
      console.error('Error fetching course:', error.message);
    },
  });
};

// Hook to complete a level
export const useCompleteLevel = () => {
  const queryClient = useQueryClient();
  return useMutation(completeLevel, {
    onSuccess: () => {
      queryClient.invalidateQueries(['progress']); // Refresh progress after completing a level
    },
    onError: (error) => {
      console.error('Error completing level:', error.message);
    },
  });
};

// Hook to complete a course
export const useCompleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation(completeCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']); // Refresh courses after completion
    },
    onError: (error) => {
      console.error('Error completing course:', error.message);
    },
  });
};

// Hook to fetch courses with completion status
export const useFetchCoursesWithCompletionStatus = () => {
  return useQuery(['completedCourses'], fetchCoursesWithCompletionStatus, {
    onError: (error) => {
      console.error('Error fetching courses with completion status:', error.message);
    },
  });
};

// Hook to fetch incompleted courses
export const useFetchIncompletedCourses = (userId) => {
  return useQuery(['incompletedCourses', userId], () => fetchIncompletedCourses(userId), {
    enabled: !!userId, // Only fetch if userId is available
    onError: (error) => {
      console.error('Error fetching incompleted courses:', error.message);
    },
  });
};

// Hook to delete a course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']); // Refresh courses after deletion
    },
    onError: (error) => {
      console.error('Error deleting course:', error.message);
    },
  });
};

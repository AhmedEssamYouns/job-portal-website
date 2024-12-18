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

// Hook to fetch all courses
export const useFetchCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
};

// Hook to fetch a course by ID
export const useFetchCourseById = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId),
    enabled: !!courseId, // Only fetch when courseId is available
  });
};

// Hook to add a new course
export const useAddCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']); // Refresh courses after adding
    },
  });
};

// Hook to delete a course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']); // Refresh courses after deleting
    },
  });
};

// Hook to complete a level
export const useCompleteLevel = () => {
  return useMutation({
    mutationFn: ({ levelId, userId }) => completeLevel(levelId, userId),
  });
};

// Hook to complete a course
export const useCompleteCourse = () => {
  return useMutation({
    mutationFn: ({ courseId, userId }) => completeCourse(courseId, userId),
  });
};

// Hook to fetch courses with completion status
export const useFetchCoursesWithCompletionStatus = () => {
  return useQuery({
    queryKey: ['coursesWithCompletion'],
    queryFn: fetchCoursesWithCompletionStatus,
  });
};

// Hook to fetch incompleted courses
export const useFetchIncompletedCourses = (userId) => {
  return useQuery({
    queryKey: ['incompletedCourses', userId],
    queryFn: () => fetchIncompletedCourses(userId),
    enabled: !!userId, // Only fetch when userId is available
  });
};

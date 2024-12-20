import axios from 'axios';
import { checkLogin, fetchUserById } from "./users";

const BASE_API_URL = 'http://localhost:5000/api/';





export const addCourse = async (courseData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}courses/add`, courseData);
        return response.data;
    } catch (error) {
        console.error('Error adding course:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to add course');
    }
};

export const fetchCourses = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}courses`);
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
};

export const fetchCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course details:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch course details');
    }
};

export const completeLevel = async (levelId, userId) => {
    try {
        const response = await axios.post(`${BASE_API_URL}progress/complete-level/${levelId}`, { userId });
        return response.data;
    } catch (error) {
        console.error('Error completing level:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to complete level');
    }
};

export const completeCourse = async (courseId, userId) => {
    try {
        const response = await axios.post(`${BASE_API_URL}progress/completed-course`, { userId, courseId });
        return response.data;
    } catch (error) {
        console.error('Error completing course:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to complete course');
    }
};

export const fetchCoursesWithCompletionStatus = async () => {
    try {
        const courses = await fetchCourses();
        const currentUser = checkLogin();

        if (!currentUser) {
            throw new Error('User not logged in');
        }

        const user = await fetchUserById(currentUser.id);

        const completedCourses = courses.filter(course =>
            user?.completedCourses.includes(course._id)
        );

        return completedCourses;
    } catch (error) {
        console.error('Error fetching courses with completion status:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch courses with completion status');
    }
};

export const fetchIncompletedCourses = async (userId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}courses/incompleted-courses/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching incompleted courses:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch incompleted courses');
    }
};

export const deleteCourse = async (courseId) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}courses/course/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete course');
    }
};

export const editCourse = async (courseId, courseData) => {
    try {
        const response = await axios.put(`${BASE_API_URL}courses/${courseId}/edit`, courseData);
        return response.data;
    } catch (error) {
        console.error('Error editing course:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to edit course');
    }
};

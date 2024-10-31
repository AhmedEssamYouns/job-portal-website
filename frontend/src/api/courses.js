import { checkLogin, fetchUserById } from "./users";

const BASE_API_URL = 'http://192.168.1.5:5000/api/';

export const fetchCourses = async () => {
    try {
        const response = await fetch(`${BASE_API_URL}courses`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch courses');
        }

        return await response.json(); // Return the list of courses
    } catch (error) {
        console.error(`Fetch courses error: ${error.message}`);
        throw new Error(`${error.message}`);
    }
};

export const fetchCourseById = async (courseId) => {
    try {
        const response = await fetch(`${BASE_API_URL}courses/${courseId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch course details');
        }

        return await response.json(); // Return the course details
    } catch (error) {
        console.error(`Fetch course error: ${error.message}`);
        throw new Error(`${error.message}`);
    }
};

export const completeLevel = async (levelId, userId) => {
    try {
        const response = await fetch(`${BASE_API_URL}progress/complete-level/${levelId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to complete level');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error completing level:', error);
    }
};

export const completeCourse = async (courseId, userId) => {
    try {
        const response = await fetch(`${BASE_API_URL}progress/completed-course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, courseId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to complete course');
        }

        const data = await response.json();
        return data; // Return the result of the course completion
    } catch (error) {
        console.error('Error completing course:', error);
        throw new Error(`${error.message}`);
    }
};

export const fetchCoursesWithCompletionStatus = async () => {
    try {
        const courses = await fetchCourses();
        const currentUser = checkLogin();

        if (!currentUser) {
            throw new Error('User not logged in');
        }

        const user = await fetchUserById(currentUser.id); // Fetch user details

        // Step 3: Filter courses by whether the user has completed them
        const completedCourses = courses.filter(course =>
            user?.completedCourses.includes(course._id) // Check if course is in completedCourses
        );

        return completedCourses; // Return all courses with completion status
    } catch (error) {
        console.error(`Error fetching courses with completion status: ${error.message}`);
        throw new Error(`${error.message}`);
    }
};


export const fetchIncompletedCourses = async (userId) => {
    try {
        const response = await fetch(`${BASE_API_URL}courses/incompleted-courses/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch incompleted courses');
        }

        return await response.json(); // Return the list of incompleted courses
    } catch (error) {
        console.error(`Fetch incompleted courses error: ${error.message}`);
        throw new Error(`${error.message}`);
    }
};
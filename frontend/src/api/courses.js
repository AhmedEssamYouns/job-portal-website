const BASE_API_URL = 'http://localhost:5000/api/';

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

// Add any additional course-related API functions here (e.g., createCourse, updateCourse, deleteCourse, etc.)

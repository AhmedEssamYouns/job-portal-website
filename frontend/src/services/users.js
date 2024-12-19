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

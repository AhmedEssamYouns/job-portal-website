const BASE_API_URL = 'http://192.168.1.5:5000/api/';

export const signup = async (userData) => {
    try {
        const response = await fetch(`${BASE_API_URL}auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Sign up failed');
        }

        return await response.json();
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};

export const login = async (userData) => {
    try {
        const response = await fetch(`${BASE_API_URL}auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Sign in failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token); // Save the token
        window.location.href = '/'; // Redirect to sign-in
        window.location.reload(); // Refresh the page after login
        return data;
    } catch (error) {
        console.error(`Sign in error: ${error.message}`);
        throw new Error(`${error.message}`);
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin'; // Redirect to sign-in
    window.location.reload(); // Ensure the page is refreshed after logout
};

export const checkLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        // Decode JWT and parse it to an object
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;  // Return user data as an object
    } catch (error) {
        console.error('Invalid token:', error);
        return false;  // Handle invalid token case
    }
};

export const fetchUserById = async (userId) => {
    try {
        const response = await fetch(`${BASE_API_URL}auth/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user data');
        }

        return await response.json(); // Return the user data
    } catch (error) {
        console.error(`Fetch user by ID error: ${error.message}`);
        throw new Error(`${error.message}`);
    }
};



import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, CircularProgress, Paper, useTheme } from '@mui/material';
import { fetchUserById } from '../api/users';
import { checkLogin } from '../api/users';
import CoursesList from '../components/CoursesList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Importing an icon

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const CurrentUser = checkLogin();
    const theme = useTheme();

    useEffect(() => {
        const loadUser = async () => {
            try {
                if (CurrentUser) {
                    const userData = await fetchUserById(CurrentUser.id);
                    setUser(userData);
                } else {
                    setError('User not logged in.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [CurrentUser]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box
            sx={{
                padding: { xs: 2, sm: 4 },
                paddingRight:{ xs: 2, sm: 14 },
                paddingLeft:{ xs: 2, sm: 14 },
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <Typography variant="h4" gutterBottom align="center">
                User Profile
            </Typography>

            {/* Profile Card */}
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 4,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                        : 'linear-gradient(135deg, #0d47a1, #1565c0)', // Gradient background
                    color: theme.palette.common.white,
                }}
            >
                <Avatar
                    src={user.avatar} // Assume user has an avatar URL
                    alt={user.name}
                    sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        marginBottom: { xs: 2, sm: 0 },
                        marginRight: { sm: 2 },
                        border: '2px solid #ffffff', // Change border color to white for contrast
                    }}
                />
                <Box textAlign={{ xs: 'center', sm: 'left' }} sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {user.name}
                    </Typography>
                    <Typography variant="body1">
                        {user.email}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <CheckCircleIcon sx={{ marginRight: 1 }} /> {/* Icon for completed courses */}
                        <Typography variant="body2" >
                            {user.completedCourses.length} Completed Courses
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <CoursesList fetchType="incompleted" />
         
            <CoursesList fetchType="completed" />
        </Box>
    );
};

export default UserProfile;

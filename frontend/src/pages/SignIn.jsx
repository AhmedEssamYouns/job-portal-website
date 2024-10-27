import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Grid, useMediaQuery, Link, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { login } from '../api/users';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(''); // Store error messages
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is mobile

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        setError(''); // Clear previous errors

        try {
            const data = await login(formData); // Call login API
            alert('Sign in successful! Welcome back!');
            console.log(data); // Log response (optional)
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            setError(error.message); // Display error message
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <Grid container sx={{ height: '90vh' }}>
            {/* Left Side: Only for larger screens */}
            {!isMobile && (
                <Grid item xs={12} sm={6} sx={{
                    backgroundImage: 'url(https://i.pinimg.com/originals/6b/1b/22/6b1b22573f9f3d4bba11a9fa5cb45652.png)',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2
                }} />
            )}

            {/* Right Side: Sign In Form */}
            <Grid item xs={12} sm={6} display="flex" flexDirection="column" justifyContent="center" gap={5} alignItems="center">
                <Box textAlign="center">
                    <Typography variant="h6">
                        Find your dream job with us. Your future starts here!
                    </Typography>
                </Box>

                <Card sx={{ width: '90%', maxWidth: 400 }}>
                    <CardContent>
                        <Typography variant="h4" align="center" gutterBottom>
                            Sign In
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading} // Disable when loading
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        {error && (
                            <Alert severity="error" sx={{ marginTop: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box textAlign="center" sx={{ marginTop: 2 }}>
                            <Typography variant="body2">
                                Don’t have an account?
                                <Link href="/signup" sx={{ marginLeft: 1 }}>
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default SignIn;

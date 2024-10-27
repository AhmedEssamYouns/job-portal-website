import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Grid, useMediaQuery, Link, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { signup } from '../api/users';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(''); // State to store error message
    const [isLoading, setIsLoading] = useState(false); // Optional: Loading state

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        setError(''); // Clear previous errors

        try {
            await signup(formData); // Call signup API
            alert('Sign up successful! Please sign in.'); // Success alert
            navigate('/signin'); // Redirect to Sign In
        } catch (error) {
            setError(error.message); // Set error message on failure
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <Grid container sx={{ height: '90vh' }}>
            {!isMobile && (
                <Grid item xs={12} sm={6} sx={{
                    backgroundImage: 'url(https://i.pinimg.com/originals/6b/1b/22/6b1b22573f9f3d4bba11a9fa5cb45652.png)',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    padding: 2
                }} />
            )}

            <Grid item xs={12} sm={6} display="flex" flexDirection={'column'} justifyContent="center" gap={5} alignItems="center">
                <Box textAlign="center">
                    <Typography variant="h6">
                        Create your account and start your journey with us!
                    </Typography>
                </Box>

                <Card sx={{ width: '90%', maxWidth: 400 }}>
                    <CardContent>
                        <Typography variant="h4" align="center" gutterBottom>
                            Sign Up
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Username"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            />
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
                                value={formData.password}
                                onChange={handleChange}
                                required
                                fullWidth
                                sx={{ marginBottom: 1 }}
                            />
                            <Typography variant="caption" color="textSecondary" sx={{ marginBottom: 2, display: 'block' }}>
                                Password must be at least 8 characters long and contain both letters and numbers.
                            </Typography>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading} // Disable button when loading
                            >
                                {isLoading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </form>

                        {error && (
                            <Alert severity="error" sx={{ marginBottom: 2, marginTop: 3 }}>
                                {error}
                            </Alert>
                        )}
                        
                        <Box textAlign="center" sx={{ marginTop: 2 }}>
                            <Typography variant="body2">
                                Already have an account?
                                <Link href="/signin" sx={{ marginLeft: 1 }}>
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default SignUp;

import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Grid, useMediaQuery, Alert, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { login } from '../../services/users';
import { useNavigate,Link } from 'react-router-dom';

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [openSnackbar, setOpenSnackbar] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState(''); 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        setError(''); 

        try {
            const data = await login(formData); 
            setSnackbarMessage('Sign in successful! Welcome back!'); 
            setOpenSnackbar(true); 
            console.log(data); 
            window.location.href = '/';
        } catch (error) {
            setError(error.message); 
            setSnackbarMessage(error.message);
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false); 
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false); // Close Snackbar
    };

    return (
        <Grid container sx={{ height: isMobile ? 'auto' : '80vh' }}>
            {/* Left Side: Only for larger screens */}
            {!isMobile && (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        component="img"
                        src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-8694031-6983270.png"
                        alt="Illustrative image"
                        sx={{
                            width: '70%',
                            height: 'auto',
                            maxWidth: '80%', // Adjusts size for responsiveness
                            objectFit: 'contain',
                        }}
                    />
                </Grid>
            )}

            {/* Right Side: Sign In Form */}
            <Grid
                item
                xs={12}
                sm={6}
                display="flex"
                flexDirection="column"
                sx={{
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.5), rgba(66, 165, 245, 0.5))',
                    borderBottomLeftRadius: '100px',
                    justifyContent: 'center',
                    height: 'auto',
                    borderRadius: '0px',
                    margin: '0px',
                    [theme.breakpoints.down('sm')]: {
                        borderBottomRightRadius: '100px',
                        borderTopLeftRadius: '100px',
                        borderTopRightRadius: '100px',
                        borderBottomLeftRadius: '100px',
                        marginTop: '20px',
                        marginRight: '10px',
                        marginLeft: '10px',
                        height: '75vh',
                    },
                }}
                padding={2}
                gap={5}
                alignItems="center"
            >
                <Box textAlign="center">
                    <Typography variant="h6">
                        Discover new skills with our courses. Your learning journey starts here!
                    </Typography>
                </Box>

                <Card sx={{ width: '90%', maxWidth: 400, borderRadius: 10, boxShadow: 5 }}>
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
                                <Typography component={Link} to={'/signup'} sx={{ marginLeft: 1 ,color:theme.palette.primary.main }}>
                                    Sign Up
                                </Typography>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Snackbar for success/error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position Snackbar
            >
                <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default SignIn;

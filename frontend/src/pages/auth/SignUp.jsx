import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Grid, useMediaQuery, Alert, IconButton, Snackbar, SnackbarContent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { signup } from '../../services/users';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [showPassword, setShowPassword] = useState(false); 
    const [successMessage, setSuccessMessage] = useState(''); 
    const [openSnackbar, setOpenSnackbar] = useState(false); 

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordVisibilityToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await signup(formData);
            setSuccessMessage('Sign up successful! Please sign in.');
            setOpenSnackbar(true); // Show success Snackbar
            setTimeout(() => {
                navigate('/signin');
            }, 2000); // Redirect to sign-in page after a short delay
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Grid container sx={{ height: '90vh' }}>
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
                        marginBottom:'20px',
                        marginRight: '5px',
                        marginLeft: '5px',
                    },
                }}
                padding={1}
                gap={5}
                alignItems="center"
            >
                <Box textAlign="center" paddingRight={3}paddingLeft={3}>
                    <Typography variant="h7">
                        Create your account and start your journey with us!
                    </Typography>
                </Box>

                <Card sx={{ width: '90%', maxWidth: 400, borderRadius: 10, boxShadow: 5 }}>
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
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={handlePasswordVisibilityToggle} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <TextField
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                fullWidth
                                sx={{ marginBottom: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={handlePasswordVisibilityToggle} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <Typography variant="caption" color="textSecondary" sx={{ marginBottom: 2, display: 'block' }}>
                                Password must be at least 8 characters long and contain both letters and numbers.
                            </Typography>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading}
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
                                <Typography component={Link} to={'/signin'} sx={{ marginLeft: 1, color: theme.palette.primary.main }}>
                                    Sign In
                                </Typography>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>

            </Grid>
        </Grid>
    );
};

export default SignUp;

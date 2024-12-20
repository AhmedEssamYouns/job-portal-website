import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLogin } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Use login hook with success and error callbacks
  const { mutate: login, isLoading } = useLogin(
    (data) => {
      // Success callback
      setSnackbarMessage('Sign in successful! Welcome back!');
      console.log(data);
      setOpenSnackbar(true);
      navigate('/');
      window.location.reload();
    },
    (error) => {
      // Error callback
      setError(error.message);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSnackbarMessage('');

    // Trigger login mutation
    try {
      await login(formData); // Mutate the formData (trigger login process)
    } catch (error) {
      // Error is handled in the mutation's onError callback
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Grid
      container
      sx={{ height: isMobile ? 'auto' : '80vh' }}
    >
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
            component='img'
            src='https://cdni.iconscout.com/illustration/premium/thumb/sign-up-8694031-6983270.png'
            alt='Illustrative image'
            sx={{
              width: '70%',
              height: 'auto',
              maxWidth: '80%',
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
        display='flex'
        flexDirection='column'
        sx={{
          background:

            'linear-gradient(135deg, rgba(25, 118, 210, 0.5), rgba(66, 165, 245, 0.5))',
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
        alignItems='center'
      >
        <Box textAlign='center'>
          <Typography variant='h6'>
            Discover new skills with our courses. Your learning journey starts
            here!
          </Typography>
        </Box>

        <Card
          sx={{ width: '90%', maxWidth: 400, borderRadius: 10, boxShadow: 5 }}
        >
          <CardContent>
            <Typography
              variant='h4'
              align='center'
              gutterBottom
            >
              Sign In
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label='Email'
                name='email'
                required
                value={formData.email}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label='Password'
                type='password'
                name='password'
                required
                value={formData.password}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {error && (
              <Alert
                severity='error'
                sx={{ marginTop: 2 }}
              >
                {error}
              </Alert>
            )}

            <Box
              textAlign='center'
              sx={{ marginTop: 2 }}
            >
              <Typography variant='body2'>
                Don’t have an account?
                <Typography
                  component={Link}
                  to={'/signup'}
                  sx={{ marginLeft: 1, color: theme.palette.primary.main }}
                >
                  Sign Up
                </Typography>
              </Typography>
              <Typography
                variant='body2'
                sx={{ marginTop: 1 }}
              >
                <Typography
                  component={Link}
                  to={'/ForgetPassword'}
                  sx={{ color: theme.palette.primary.main }}
                >
                  Reset your password
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SignIn;

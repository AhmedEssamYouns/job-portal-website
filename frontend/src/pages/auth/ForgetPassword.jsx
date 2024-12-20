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
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSnackbarMessage('');

    // Simulate email verification API call
    try {
      if (!formData.email) {
        throw new Error('Email is required.');
      }
      // Simulate successful email verification
      setEmailVerified(true);
      setSnackbarMessage('Email verified! Please set your new password.');
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.message);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSnackbarMessage('');

    // Simulate password reset API call
    try {
      if (!formData.newPassword || !formData.confirmPassword) {
        throw new Error('Both password fields are required.');
      }
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      setSnackbarMessage('Password reset successfully! You can now log in.');
      setOpenSnackbar(true);
      // Navigate to login page after success
      navigate('/SignIn');
    } catch (error) {
      setError(error.message);
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
            src='https://cdni.iconscout.com/illustration/premium/thumb/password-reset-8694031-6983270.png'
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

      {/* Right Side: Forgot Password Form */}
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
            Reset your password to regain access to your account.
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
              {emailVerified ? 'Set New Password' : 'Verify Email'}
            </Typography>

            {!emailVerified ? (
              <form onSubmit={handleEmailSubmit}>
                <TextField
                  label='Email'
                  name='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                >
                  Verify Email
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <TextField
                  label='New Password'
                  type='password'
                  name='newPassword'
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label='Confirm Password'
                  type='password'
                  name='confirmPassword'
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                >
                  Reset Password
                </Button>
              </form>
            )}

            {error && (
              <Alert
                severity='error'
                sx={{ marginTop: 2 }}
              >
                {error}
              </Alert>
            )}
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

export default ForgetPassword;

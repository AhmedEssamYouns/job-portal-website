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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../services/users';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSnackbarMessage('');

    // Validate fields
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required.');
      setOpenSnackbar(true);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password must match.');
      setOpenSnackbar(true);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from the current password.');
      setOpenSnackbar(true);
      return;
    }

    // Call API to change password
    try {
      const response = await changePassword(formData.currentPassword, formData.newPassword);
      setSnackbarMessage(response.message || 'Password changed successfully!');
      setOpenSnackbar(true);
      navigate('/'); 
    } catch (error) {
      setError(error.message || 'An error occurred while changing the password.');
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

      {/* Right Side: Change Password Form */}
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
            Secure your account by updating your password regularly.
          </Typography>
        </Box>

        <Card sx={{ width: '90%', maxWidth: 400, borderRadius: 10, boxShadow: 5 }}>
          <CardContent>
            <Typography variant='h4' align='center' gutterBottom>
              Change Password
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label='Current Password'
                type={showPassword ? 'text' : 'password'}
                name='currentPassword'
                required
                value={formData.currentPassword}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleClickShowPassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label='New Password'
                type={showPassword ? 'text' : 'password'}
                name='newPassword'
                required
                value={formData.newPassword}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleClickShowPassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label='Confirm Password'
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleClickShowConfirmPassword} edge='end'>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type='submit' variant='contained' color='primary' fullWidth>
                Change Password
              </Button>
            </form>

            {error && (
              <Alert severity='error' sx={{ marginTop: 2 }}>
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
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ChangePassword;

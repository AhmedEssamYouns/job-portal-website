import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Paper, useTheme, Button, Grid, CircularProgress,
} from '@mui/material';
import { fetchUserById, checkLogin, useProfileImage } from '../../services/users';
import { uploadProfileImage, getProfileImage } from '../../services/users';
import CoursesList from '../../shared/Course/client/CoursesList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassLoader from '../../shared/Loaders/Components/Hamster';
import SignIn from '../auth/SignIn';
import { useFetchUserById } from '../../hooks/useAuth';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const CurrentUser = checkLogin();
  const theme = useTheme();
  const { data: userData, isLoading: userLoading, isError: userError, error: userFetchError } = useFetchUserById(CurrentUser?.id);

  // Fetch profile image if user has one
  const { data: imageUrl, isLoading: imageLoading, isError: imageError, error: imageFetchError } = useProfileImage(userData?.profileImage);

  // Combine user data and image once both are fetched
  React.useEffect(() => {
    if (userData) {
      if (userData.profileImage) {
        setUser({
          ...userData,
          avatar: imageUrl,
        });
      } else {
        setUser(userData); // No profile image available
      }
      setLoading(false);
    }
  }, [userData, imageUrl]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarLoading(true);
      try {
        const response = await uploadProfileImage(CurrentUser.id, file);
        const imageSrc = await getProfileImage(response.user.profileImage);
        setUser((prevUser) => ({ ...prevUser, avatar: imageSrc }));
      } catch (err) {
        console.error('Error uploading image:', err);
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  if (loading || imageLoading || userLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <HourglassLoader />
      </Box>
    );
  }

  if (error) {
    return <SignIn />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 4,
        padding: { xs: 2, sm: 10 },
        paddingRight: { xs: 2, sm: 20 },
        paddingLeft: { xs: 2, sm: 20 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
            : 'linear-gradient(135deg, #0d47a1, #1565c0)',
          color: theme.palette.common.white,
          textAlign: 'center',
          maxWidth: '400px',
          maxHeight: '350px',
        }}
      >
        {avatarLoading ? (
          <Box 
            height="350px" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Avatar
            src={user.avatar || 'https://th.bing.com/th/id/OIP.XmhhHP-RnTJSSDJsNshpUQHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7'}
            alt={user.name}
            sx={{
              width: 120,
              height: 120,
              marginBottom: 2,
              border: '2px solid #ffffff',
            }}
          />
        )}
        <Typography variant="body1" sx={{ mb: 1 }}>
          {user.email}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          @{user.username}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
          {user.completedCourses.length > 0 && (
            <>
              <Typography variant="body2" sx={{ marginRight: 1 }}>
                {user.completedCourses.length} Completed Courses
              </Typography>
              <CheckCircleIcon sx={{ color: 'limegreen' }} />
            </>
          )}
        </Box>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="icon-button-file">
          <Button variant="contained" component="span" sx={{ mt: 2 }}>
            Upload Photo
          </Button>
        </label>
      </Paper>

      <Box
        sx={{
          flex: 1,
          padding: { xs: 2, sm: 2 },
          marginLeft: { sm: 2 },
          backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#0a0a0a',
          borderRadius: 2,
          boxShadow: 3,
          minHeight: '350px',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Your Courses
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CoursesList  fetchType="incompleted" />
          </Grid>
          {user.enrolledCourses.length > 0 && (
              <Grid item xs={16}>
                <CoursesList  fetchType="enrolled" />
              </Grid>
        )}
          <Grid item xs={16}>
            <CoursesList  fetchType="completed" />
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default UserProfile;

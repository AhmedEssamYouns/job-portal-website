import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Box, LinearProgress, Snackbar, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { checkLogin, fetchUserById } from '../api/users';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'; // Import the icon
import { fetchCourseById } from '../api/courses';
import './SocialIcons.css';

const CourseCard = ({ course }) => {
  const [user, setUser] = useState(null);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [totalLevels, setTotalLevels] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = checkLogin();
      if (currentUser) {
        try {
          const userData = await fetchUserById(currentUser.id);
          setUser(userData);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadCourseLevels = async () => {
      try {
        const courseData = await fetchCourseById(course._id);
        if (courseData.levels) {
          setTotalLevels(courseData.levels.length);
          const completedLevels = courseData.levels.filter(level =>
            level.completedByUsers.some(completedUser => completedUser.userId === user?._id)
          ).length;
          setLevelsCompleted(completedLevels);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      loadCourseLevels();
    }
  }, [user, course._id]);

  const isCourseCompleted = user?.completedCourses.includes(course._id);
  const theme = useTheme();

  const handleCardClick = () => {
    if (loading) return;
    if (!user) {
      setOpenSnackbar(true);
    } else {
      navigate(`/course/${course._id}`);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Placeholder Card Component
  const PlaceholderCard = () => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 3,
        borderRadius: 2,
        cursor: 'not-allowed',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', opacity: 0.5 }}>
          Loading...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, opacity: 0.5 }}>
          Please wait while we load the course details.
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <>
      {loading ? (
        <PlaceholderCard />
      ) : (
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: 3,
            borderRadius: 2,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: loading ? 'none' : 'scale(1.05)',
              boxShadow: loading ? 3 : 6,
            },
          }}
          onClick={handleCardClick}
        >
          {isCourseCompleted && ( // Award Emblem at the top left
            <MilitaryTechIcon
              style={{
                position: 'absolute',
                top: '-7px',
                right: '0px',
                color: theme.palette.mode == 'light' ? 'black' : 'whitesmoke', // Adjust color as needed
                width: '60px', // Adjust size as needed
                height: 'auto',
              }}
            />
          )}
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" width={'260px'} sx={{ fontWeight: 'bold' }}>
              {course.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {course.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Language:</strong> {course.language}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', mt: 'auto', flexDirection: { xs: 'column', md: 'row' } }}>
            {levelsCompleted > 0 && (
              <Box sx={{ mt: 2, width: '100%' }}>
                <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'center', md: 'left' }}>
                  Progress: {levelsCompleted} of {totalLevels} levels completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(levelsCompleted / totalLevels) * 100}
                  sx={{ height: 10, borderRadius: 5, mt: 1 }}
                />
              </Box>
            )}

            {isCourseCompleted && (
              <Box
                sx={{
                  display: 'flex',
                  alignSelf:'flex-end',
                  alignItems: 'center',
                  padding: '2px 4px', // Reduced padding for a smaller size
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                    : 'linear-gradient(135deg, #0d47a1, #1565c0)',
                  borderRadius: 1,
                  marginTop: { xs: 1, md: 0 }, // Adjust margin based on screen size
                  width: 'auto', // Auto width for responsiveness
                }}
              >
                <Typography variant="body2" color="white" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Completed
                </Typography>
                <CheckCircleIcon sx={{ color: 'white', marginLeft: 0.5, fontSize: { xs: '16px', md: '20px' } }} />
              </Box>
            )}
          </CardActions>


        </Card>
      )}

      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message="Access denied. You need to sign in first."
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            backgroundColor: '#f44336',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
      />
    </>
  );
};

export default CourseCard;

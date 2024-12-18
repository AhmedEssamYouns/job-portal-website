import React, { useState } from 'react';
import CourseCard from './CourseCard';
import { Grid, CircularProgress, Typography, Box, Button } from '@mui/material';
import { useFetchCourses, useFetchCoursesWithCompletionStatus, useFetchIncompletedCourses } from '../../../hooks/useCourses';
import { useNavigate } from 'react-router-dom';
import HourglassLoader from '../../Loaders/Components/Hamster';
import { checkLogin } from '../../../services/users';

const CoursesList = ({ fetchType }) => {
  const navigate = useNavigate();
  const user = checkLogin();

  // Always call hooks unconditionally
  const { data: completedCourses = [], isLoading: isLoadingCompleted, isError: isErrorCompleted, error: errorCompleted } = useFetchCoursesWithCompletionStatus();
  const { data: incompletedCourses = [], isLoading: isLoadingIncompleted, isError: isErrorIncompleted, error: errorIncompleted } = useFetchIncompletedCourses(user?.id);
  const { data: allCourses = [], isLoading: isLoadingAll, isError: isErrorAll, error: errorAll } = useFetchCourses();

  let courses = [];
  let isLoading = false;
  let isError = false;
  let error = null;

  // Select the appropriate data and state based on `fetchType`
  switch (fetchType) {
    case 'completed':
      courses = completedCourses;
      isLoading = isLoadingCompleted;
      isError = isErrorCompleted;
      error = errorCompleted;
      break;
    case 'incompleted':
      courses = incompletedCourses;
      isLoading = isLoadingIncompleted;
      isError = isErrorIncompleted;
      error = errorIncompleted;
      break;
    default:
      courses = allCourses;
      isLoading = isLoadingAll;
      isError = isErrorAll;
      error = errorAll;
  }
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '100px',
        }}
      >
        <HourglassLoader />
      </Box>
    );
  }

  if (isError) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box>
      {fetchType === 'incompleted' && courses.length > 0 && (
        <Typography variant="h5" gutterBottom align="center" sx={{ marginTop: 2 }}>
          Current Learning Courses
        </Typography>
      )}
      {fetchType === 'completed' && courses.length > 0 && (
        <Typography variant="h5" gutterBottom align="center" sx={{ marginTop: 2 }}>
          Completed Courses
        </Typography>
      )}

      {courses.length === 0 ? (
        <Box textAlign="center" sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            {fetchType === 'incompleted' ? "Start a New Course Today!" : ""}
          </Typography>
          {fetchType === 'incompleted' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/courses')}
              sx={{
                animation: 'bounce 1.5s infinite', // Add bounce animation
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                  '40%': { transform: 'translateY(-10px)' },
                  '60%': { transform: 'translateY(-5px)' },
                },
                mt: 2,
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontWeight: 'bold',
                boxShadow: (theme) => theme.shadows[4],
              }}
            >
              Browse Courses
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ paddingBottom: '20px', marginTop: 2, justifyContent: 'center' }}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CoursesList;

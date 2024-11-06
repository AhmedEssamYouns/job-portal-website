import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { Grid, CircularProgress, Typography, Box, Button } from '@mui/material';
import { fetchCourses, fetchCoursesWithCompletionStatus, fetchIncompletedCourses } from '../api/courses';
import { checkLogin } from '../api/users';
import { useNavigate } from 'react-router-dom';
import HourglassLoader from './loader';

const CoursesList = ({ fetchType }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        let coursesData;

        switch (fetchType) {
          case 'completed':
            coursesData = await fetchCoursesWithCompletionStatus();
            break;
          case 'incompleted':
            const user = checkLogin();
            if (!user) throw new Error('User not logged in');
            coursesData = await fetchIncompletedCourses(user.id);
            break;
          default:
            coursesData = await fetchCourses();
        }

        setCourses(coursesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [fetchType]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '100px'
        }}
      >
        <HourglassLoader />
      </Box>

    );
  }

  if (error) return <Typography color="error">Error: {error}</Typography>;

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
                boxShadow: theme => theme.shadows[4],
              }}
            >
              Browse Courses
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ paddingBottom: '20px', marginTop: 2, justifyContent: 'center', }}>
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

import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import { fetchCourses, fetchCoursesWithCompletionStatus, fetchIncompletedCourses } from '../api/courses';
import { checkLogin } from '../api/users';

const CoursesList = ({ fetchType }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        let coursesData;

        // Fetch courses based on the fetchType prop
        switch (fetchType) {
          case 'completed':
            coursesData = await fetchCoursesWithCompletionStatus();
            break;
          case 'incompleted':
            const user = checkLogin(); 
            if (!user) throw new Error('User not logged in');
            coursesData = await fetchIncompletedCourses(user.id);
            break;
          default: // 'all'
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
  }, [fetchType]); // Dependency array to refetch if fetchType changes

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          height: '100vh', // Optional: Set height if you want some space
          marginTop: '20px' // Adjust margin if needed
        }}
      >
        <CircularProgress />
      </Box>
    ); 
  }

  if (error) return <Typography color="error">Error: {error}</Typography>; // Display error message

  return (
    <Grid container spacing={2} sx={{ paddingBottom: '20px' }}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <CourseCard course={course} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CoursesList;

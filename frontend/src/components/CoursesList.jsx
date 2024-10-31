import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { Grid, CircularProgress, Typography, Box } from '@mui/material'; // Import Box for centering
import { fetchCourses } from '../api/courses';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

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
    ); // Show a loading spinner centered horizontally
  }

  if (error) return <Typography color="error">Error: {error}</Typography>; // Display error message

  return (
    <Grid container spacing={2} sx={{ paddingBottom: '20px' }}> {/* Added paddingBottom here */}
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <CourseCard course={course} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CoursesList;

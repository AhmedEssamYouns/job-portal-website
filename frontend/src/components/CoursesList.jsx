import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { Grid, CircularProgress, Typography } from '@mui/material'; // Added CircularProgress and Typography
import { fetchCourses } from '../api/courses'; // Import the fetchCourses function

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses(); // Use the fetchCourses function
        setCourses(coursesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) return <CircularProgress />; // Show a loading spinner
  if (error) return <Typography color="error">Error: {error}</Typography>; // Display error message

  return (
    <Grid container spacing={2}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <CourseCard course={course} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CoursesList;

// SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import CourseCard from '../Shared/Course/client/CourseCard';
import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import { fetchCourses } from '../api/courses';
import { useLocation } from 'react-router-dom';
import HourglassLoader from '../Shared/Loaders/Components/Hamster';

const SearchResultsPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(useLocation().search).get('q'); 

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
          height: '100vh',
          marginTop: '20px',
        }}
      >
        <HourglassLoader />
      </Box>
    );
  }

  if (error) return <Typography color="error">Error: {error}</Typography>;

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Box sx={{ padding: { xs: 5, sm: 10 } }}>
      <Typography variant="h5" gutterBottom>
        Search Results for: "{query}"
      </Typography>
      <Grid container spacing={2}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <CourseCard course={course} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No courses found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchResultsPage;

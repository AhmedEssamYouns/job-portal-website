// SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import { fetchCourses } from '../api/courses';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(useLocation().search).get('q'); // Get search query from URL

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
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Typography color="error">Error: {error}</Typography>;

  // Filter courses based on the search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Box sx={{ padding: 10 }}>
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

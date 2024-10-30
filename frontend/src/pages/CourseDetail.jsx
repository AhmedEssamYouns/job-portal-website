import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseById } from '../api/courses'; // Ensure this function is implemented in your API file
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';

const CourseDetail = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await fetchCourseById(id); // Fetch course by ID
        setCourse(courseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);


  if (loading) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // Full viewport height
            }}
        >
            <CircularProgress />
        </Box>
    );
}
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>
      <Typography variant="h6" gutterBottom>Description:</Typography>
      <Typography variant="body1" paragraph>
        {course.description}
      </Typography>
      <Typography variant="h6" gutterBottom>Language:</Typography>
      <Typography variant="body1" paragraph>
        {course.language}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Levels
      </Typography>
      <Grid container spacing={2}>
        {course.levels.map((level) => (
          <Grid item xs={12} sm={6} md={4} key={level._id}>
            <Link to={`/course/${id}/level/${level._id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ height: '100%', cursor: 'pointer', ':hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Typography variant="h6">{level.title}</Typography>
                  {/* Add any additional level details here */}
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseDetail;

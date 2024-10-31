import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseById } from '../api/courses'; // Ensure this function is implemented in your API file
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { checkLogin } from '../api/users';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

const CourseDetail = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Get the current theme
  const CurrentUser = checkLogin();

  const isLevelCompletedByUser = (level) => {
    return level.completedByUsers.some(user => user.userId === CurrentUser.id);
  };

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await fetchCourseById(id); 
        setCourse(courseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);
const currentuser = checkLogin()
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ padding: 4, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        {course.title}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Description:
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: theme.palette.text.secondary }}>
        {course.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Language:
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: theme.palette.text.secondary }}>
        {course.language}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4, fontWeight: 'bold' }}>
        Levels
      </Typography>
      <Grid container spacing={2}>
        {course.levels.map((level) => (
          <Grid item xs={12} sm={6} md={4} key={level._id}>
            <Link to={`/course/${id}/level/${level._id}`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column', // Arrange content in a column
                  position: 'relative', // Position relative for absolute positioning
                  ':hover': { boxShadow: 6 },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <CardContent sx={{ flex: 1 }}> {/* Allow the CardContent to grow */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {level.title}
                  </Typography>
                </CardContent>

                {isLevelCompletedByUser(level) && (
                  <Box
                    sx={{
                      position: 'absolute', // Position it at the bottom left
                      bottom: 8,
                      right: 8,
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: theme.palette.background.paper, // Optional: background for contrast
                      padding: '2px 4px', // Padding for better appearance
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: green[500],
                        fontSize: '0.875rem',
                        mr: 0.5, // Margin between text and icon
                      }}
                    >
                      Completed
                    </Typography>
                    <CheckCircleIcon
                      sx={{
                        fontSize: 20,
                        color: green[500],
                      }}
                    />
                  </Box>
                )}
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseDetail;

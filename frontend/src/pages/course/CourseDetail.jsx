import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseById } from '../../api/courses';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { checkLogin, fetchUserById } from '../../api/users';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';
import HourglassLoader from '../../Shared/Loaders/Components/Hamster';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const CurrentUser = checkLogin();

  const isLevelCompletedByUser = (level) => {
    return level.completedByUsers.some(user => user.userId === CurrentUser.id);
  };

  const allPreviousLevelsCompleted = (index) => {
    return course.levels.slice(0, index).every(level => isLevelCompletedByUser(level));
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

  const [user, setUser] = useState(null);

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
    };

    loadUser();
  }, []);

  const isCourseCompleted = user?.completedCourses.includes(course?._id);

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
        <HourglassLoader />
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

      {/* Display course completion status */}
      {isCourseCompleted && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography variant="body1" sx={{ color: green[500], fontWeight: 'bold', mr: 1 }}>
            Completed
          </Typography>
          <CheckCircleIcon sx={{ color: green[500] }} />
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4, fontWeight: 'bold' }}>
        Levels
      </Typography>
      <Grid container spacing={2}>
        {course.levels.map((level, index) => (
          <Grid item xs={12} sm={6} md={4} key={level._id}>
            <Link
              to={allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? `/course/${id}/level/${level._id}` : '#'}
              style={{
                textDecoration: 'none',
                pointerEvents: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 'auto' : 'none',
                opacity: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 1 : 0.5,
              }}
              onClick={(e) => {
                if (!(allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level))) {
                  e.preventDefault();
                  alert("You must complete all previous levels first!");
                  return;
                }
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  paddingBottom: 2,
                  flexDirection: 'column',
                  position: 'relative',
                  ':hover': { boxShadow: 6 },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {level.title}
                  </Typography>
                </CardContent>

                {isLevelCompletedByUser(level) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: theme.palette.background.paper,
                      padding: '2px 4px',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: green[500],
                        fontSize: '0.875rem',
                        mr: 0.5,
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

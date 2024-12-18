import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchCourseById } from '../../hooks/useCourses';
import { useFetchUserById } from '../../hooks/useAuth';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';
import HourglassLoader from '../../test/Loaders/Components/Hamster';
import { checkLogin } from '../../services/users';
import CommentsSection from './components/comments';

const CourseDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const CurrentUser = checkLogin();



  const { data: course, isLoading, isError, error } = useFetchCourseById(id);
  const { data: user, isLoading: userLoading } = useFetchUserById(CurrentUser?.id);

  const isLevelCompletedByUser = (level) => {
    return level.completedByUsers.some(user => user.userId === CurrentUser.id);
  };

  const allPreviousLevelsCompleted = (index) => {
    return course?.levels.slice(0, index).every(level => isLevelCompletedByUser(level));
  };

  if (isLoading || userLoading) {
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

  if (isError || !course) {
    return <Typography color="error">Error: {error?.message || 'Unable to fetch course data'}</Typography>;
  }

  const isCourseCompleted = user?.completedCourses.includes(course?._id);



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
      <Grid container spacing={2} pb={5} borderBottom={1} mb={2} borderColor={theme.palette.divider}>
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

      {/* Comments Section */}
      <CommentsSection
        currentUserId={CurrentUser?.id}
      />
    </Box>
  );
};

export default CourseDetail;

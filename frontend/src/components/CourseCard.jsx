import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { checkLogin, fetchUserById } from '../api/users';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import CheckCircle icon

const CourseCard = ({ course }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = checkLogin();
      if (currentUser) {
        try {
          const userData = await fetchUserById(currentUser.id);
          setUser(userData);
        } catch (err) {
          console.error(err); // Optionally handle errors
        }
      }
    };

    loadUser();
  }, []);

  const isCourseCompleted = user?.completedCourses.includes(course._id);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 3, // Add shadow for depth
        borderRadius: 2, // Rounded corners
        transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition
        '&:hover': {
          transform: 'scale(1.05)', // Scale effect on hover
          boxShadow: 6, // Increased shadow on hover
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {course.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Language:</strong> {course.language}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-start', mt: 'auto' }}>
        <Link to={`/course/${course._id}`} style={{ textDecoration: 'none' }}>
          <Button size="small" variant="contained" color="primary">
            View Details
          </Button>
        </Link>
      </CardActions>
      {isCourseCompleted && ( // Display the checkmark if course is completed
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 5,
            gap: '5px',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px', // Added padding for better spacing
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background for contrast
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="green">
            Completed
          </Typography>
          <CheckCircleIcon sx={{ color: 'green', marginLeft: 0.5 }} />
        </Box>
      )}
    </Card>
  );
};

export default CourseCard;

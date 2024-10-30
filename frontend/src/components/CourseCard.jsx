import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {



  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
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
    </Card>
  );
};

export default CourseCard;

import React from 'react';
import { Container, Typography } from '@mui/material';
import CoursesList from '../../shared/Course/client/CoursesList';

const CoursesPage = () => {
    return (
        <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Explore Our Courses
            </Typography>
            <CoursesList fetchType="all" /> 
        </Container>
    );
};

export default CoursesPage;

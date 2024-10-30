import React from 'react';
import { Container, Typography, Grid2, Card, CardContent, Button, Box, TextField } from '@mui/material';
import CoursesList from '../components/CoursesList';

const HomePage = () => {
    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to solo-learn
            </Typography>

            <Typography variant="h5" gutterBottom>
                Featured courses
            </Typography>
            <Grid2 container spacing={4}>
               <CoursesList/>
            </Grid2>
        </Container>
    );
};

export default HomePage;

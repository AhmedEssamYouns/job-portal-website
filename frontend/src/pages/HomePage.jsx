import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, TextField } from '@mui/material';

const HomePage = () => {
    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to Job Portal
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
                Find Your Dream Job Today!
            </Typography>
            
            <Typography variant="h5" gutterBottom>
                Featured Jobs
            </Typography>
            <Grid container spacing={4}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Job Title {index + 1}</Typography>
                                <Typography color="textSecondary">Company Name</Typography>
                                <Typography variant="body2" component="p">
                                    Brief job description goes here. This is a placeholder for the actual job listing.
                                </Typography>
                                <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                    Apply Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;

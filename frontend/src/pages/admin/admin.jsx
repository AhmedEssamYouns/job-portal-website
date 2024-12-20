import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, CircularProgress, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminCourseCard from '../../shared/Course/admin/AdminCourseCard';
import { fetchCourses, deleteCourse } from '../../services/courses'; 
import { Link } from 'react-router-dom';
const AdminPanal = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');  // success or error

    // Fetch courses from API when component mounts
    useEffect(() => {
        const getCourses = async () => {
            try {
                const fetchedCourses = await fetchCourses();
                setCourses(fetchedCourses);
                setFilteredCourses(fetchedCourses);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        getCourses();
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        const filtered = courses.filter(course =>
            course.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    const handleEditCourse = (course) => {
        console.log(`Edit course: ${course.title}`);
    };

    const handleDeleteCourse = async (courseId) => {
        setLoading(true); // Show the loading spinner during delete
        try {
            await deleteCourse(courseId); // Delete the course from the server

            setSnackbarMessage('Course deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Refetch the courses after deletion
            await fetchCourses().then(fetchedCourses => {
                setCourses(fetchedCourses);
                setFilteredCourses(fetchedCourses);
            });

        } catch (error) {
            console.error('Error deleting course:', error.message);
            setSnackbarMessage('Failed to delete course.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false); // Hide the loading spinner after the delete operation
        }
    };

    // New function to update the course locally after edit
    const handleUpdateCourse = (courseId, updatedCourseData) => {
        // Update the courses state with the new data
        setCourses(prevCourses => 
            prevCourses.map(course => 
                course._id === courseId ? { ...course, ...updatedCourseData } : course
            )
        );

        // Update the filteredCourses state as well (in case the search query filters the list)
        setFilteredCourses(prevFilteredCourses => 
            prevFilteredCourses.map(course => 
                course._id === courseId ? { ...course, ...updatedCourseData } : course
            )
        );

        // Show success message after updating
        setSnackbarMessage('Course updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <TextField
                    label="Search Courses"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    fullWidth
                    sx={{ mr: 2 }}
                />
                <Button
                    component={Link}
                    to="/admin/addCourse"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Add New Course
                </Button>
            </Box>

            <Typography variant="h5" gutterBottom>
                Course List
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredCourses.map(course => (
                        <Grid item xs={12} sm={6} md={4} key={course._id}>
                            <AdminCourseCard
                                course={course}
                                onEdit={handleEditCourse}
                                onDelete={handleDeleteCourse}
                                onUpdateCourse={handleUpdateCourse}  // Pass onUpdateCourse as prop
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {filteredCourses.length === 0 && !loading && (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    No courses found.
                </Typography>
            )}

            {/* Snackbar for showing delete result */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity} // 'success' or 'error'
            />
        </Container>
    );
};

export default AdminPanal;

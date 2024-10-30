import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Drawer } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

const LevelDrawer = ({ open, onClose, course, setCurrentSlideIndex, setUserAnswer, setIsCorrect }) => {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '240px', // Adjust width as necessary
                },
            }}
        >
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6">Levels</Typography>
                {course.levels.map((level) => (
                    <Link
                        key={level._id}
                        onClick={() => {
                            setCurrentSlideIndex(0); // Reset to first slide
                            setUserAnswer(''); // Optionally reset user answer
                            setIsCorrect(false); // Optionally reset correctness
                        }}
                        to={`/course/${course._id}/level/${level._id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Card
                            sx={{
                                marginBottom: 1,
                                backgroundColor: level._id === course.currentLevelId ? '#e0e0e0' : 'inherit',
                            }}
                        >
                            <CardContent>
                                <Typography variant="body1">
                                    <ListAltIcon sx={{ marginRight: 1 }} />
                                    {level.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Box>
        </Drawer>
    );
};

export default LevelDrawer;

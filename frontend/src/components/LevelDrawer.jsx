import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Drawer, useTheme } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

const LevelDrawer = ({ open, onClose, course, setCurrentSlideIndex, setUserAnswer, setIsCorrect, Level, CurrentUser }) => {
    const theme = useTheme();

    const isLevelCompletedByUser = (level) => {
        return level.completedByUsers.some(user => user.userId === CurrentUser); // Ensure userId matches CurrentUser's ID
    };

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
                            setIsCorrect(null); // Reset correctness to null instead of false
                        }}
                        to={`/course/${course._id}/level/${level._id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Card
                            sx={{
                                marginBottom: 1,
                                paddingBottom:1,
                                backgroundColor: level._id === Level ? (theme.palette.mode === 'dark' ? '#222' : '#e0e0e0') : 'inherit',
                                position: 'relative', // Make sure to position the Box correctly within the Card
                            }}
                        >
                            <CardContent>
                                <Typography variant="body1">
                                    {level.title}
                                </Typography>
                                {isLevelCompletedByUser(level) && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8, // Distance from the bottom edge
                                            right: 8,  // Distance from the right edge
                                            display: 'flex',
                                            alignItems: 'center',
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
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Box>
        </Drawer>
    );
};

export default LevelDrawer;

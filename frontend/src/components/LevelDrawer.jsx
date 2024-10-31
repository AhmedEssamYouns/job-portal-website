import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Drawer, useTheme } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';
const LevelDrawer = ({ open, onClose, course, setCurrentSlideIndex, setUserAnswer, setIsCorrect, Level, CurrentUser }) => {
    const theme = useTheme();

    const isLevelCompletedByUser = (level) => {
        return level.completedByUsers.some(user => user.userId === CurrentUser);
    };

    const allPreviousLevelsCompleted = (index) => {
        return course.levels.slice(0, index).every(level => isLevelCompletedByUser(level));
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '240px',
                },
            }}
        >
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6">Levels</Typography>
                {course.levels.map((level, index) => (
                    <Link
                        key={level._id}
                        to={allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? `/course/${course._id}/level/${level._id}` : '#'}
                        style={{
                            textDecoration: 'none',
                            pointerEvents: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 'auto' : 'none',
                            opacity: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 1 : 0.5,
                        }}
                        onClick={(e) => {
                            if (!(allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level))) {
                                e.preventDefault(); // Prevent navigation if conditions are not met
                                alert("You must complete all previous levels first!");
                                return;
                            }
                            setCurrentSlideIndex(0);
                            setUserAnswer('');
                            setIsCorrect(null);
                        }}
                    >
                        <Card
                            sx={{
                                marginBottom: 1,
                                paddingBottom: 1,
                                backgroundColor: level._id === Level ? (theme.palette.mode === 'dark' ? '#222' : '#e0e0e0') : 'inherit',
                                position: 'relative',
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
                                            bottom: 8,
                                            right: 8,
                                            display: 'flex',
                                            alignItems: 'center',
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
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Box>
        </Drawer>
    );
};

export default LevelDrawer;

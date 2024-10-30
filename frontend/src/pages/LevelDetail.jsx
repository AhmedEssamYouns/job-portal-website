import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCourseById } from '../api/courses';
import { Box, Typography, Grid, CircularProgress, IconButton, Grid2, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LevelDrawer from '../components/LevelDrawer';
import SlideContent from '../components/SlideContent';
import Question from '../components/Question';
import NavigationButtons from '../components/NavigationButtons';
import { gruvboxDark, coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MenuIcon from '@mui/icons-material/Menu'; // Import the Menu icon
import { useMediaQuery } from '@mui/material';

const LevelDetail = () => {
    const { courseId, levelId } = useParams();
    const [course, setCourse] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:970px)');

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const courseData = await fetchCourseById(courseId);
                setCourse(courseData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCourse();
    }, [courseId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Typography color="error">Error: {error}</Typography>;

    const selectedLevel = course.levels.find(level => level._id === levelId);
    const slides = selectedLevel ? selectedLevel.slides : [];
    const currentSlide = slides[currentSlideIndex];
    const currentQuestions = currentSlide?.questions || [];

    const getNextButtonText = () => {
        if (currentSlideIndex < slides.length - 1) {
            return "Next Slide";
        } else {
            const currentLevelIndex = course.levels.findIndex(level => level._id === levelId);
            if (currentLevelIndex < course.levels.length - 1) {
                return "Next Level";
            } else {
                return "Course Finished";
            }
        }
    };

    
    const nextSlide = () => {
        if (isCorrect) {
            if (currentSlideIndex < slides.length - 1) {
                setCurrentSlideIndex(currentSlideIndex + 1);
                setUserAnswer('');
                setIsCorrect(null);
            } else {
                const currentLevelIndex = course.levels.findIndex(level => level._id === levelId);
                if (currentLevelIndex < course.levels.length - 1) {
                    const nextLevelId = course.levels[currentLevelIndex + 1]._id;
                    setCurrentSlideIndex(0);
                    setUserAnswer('');
                    setIsCorrect(null);
                    window.location.href = `/course/${courseId}/level/${nextLevelId}`;
                } else {
                    alert("Course completed!");
                }
            }
        }
    };

    const previousSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
            setUserAnswer('');
            setIsCorrect(null);
        }
    };

    const handleAnswerSelect = (answer) => {
        setUserAnswer(answer);
        const isAnswerCorrect = currentQuestions.some(q => q.correctAnswers.includes(answer)) || null ;
        setIsCorrect(isAnswerCorrect);
    };

    return (
        <Box sx={{ padding: 5, height: '100vh', display: 'flex', flexDirection: 'column' }}>


            {/* Show the drawer button for mobile view */}
            {isMobile && (
                <>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {course.title}
                    </Typography>
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            mb: 1,
                            bgcolor: theme.palette.background.paper, // Background color
                            borderRadius: 1, // Rounded corners
                            '&:hover': {
                                bgcolor: theme.palette.action.hover, // Hover effect
                            },
                            display: 'flex', // Use flex to align items
                            alignItems: 'center', // Center items vertically
                            justifyContent: 'flex-start', // Align items to the left
                            textAlign: 'left',
                            padding: '8px', // Add padding for better click area
                        }}
                    >
                        <MenuIcon sx={{ mr: 1 }} /> {/* Add right margin to the icon */}
                        <Typography variant="body1">Show Levels</Typography> {/* Add text next to the icon */}
                    </IconButton>



                </>
            )}

            {/* LevelDrawer Component */}
            <LevelDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                course={course}
                setCurrentSlideIndex={setCurrentSlideIndex}
                setUserAnswer={setUserAnswer}
                setIsCorrect={setIsCorrect}
            /><Grid container spacing={2} sx={{ flexGrow: 1, height: '100%' }}>
            {/* Render levels for larger screens */}
            {!isMobile && (
                <Grid item xs={12} sm={3} sx={{ bgcolor: theme.palette.background.paper, padding: 2, borderRadius: 2 }}>
                    <Typography variant="h4" marginBottom={'25px'} gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {course.title}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        Levels
                    </Typography>
                    {course.levels.map((level) => (
                        <Link
                            key={level._id}
                            onClick={() => {
                                setCurrentSlideIndex(0); // Reset to first slide
                                setUserAnswer(''); // Optionally reset user answer
                                setIsCorrect(null); // Optionally reset correctness
                            }}
                            to={`/course/${courseId}/level/${level._id}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <Card
                                sx={{
                                    marginBottom: 1,
                                    backgroundColor: level._id === levelId ? (theme.palette.mode === 'dark' ? '#424242' : '#e0e0e0') : 'inherit'
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body1" sx={{ fontWeight: level._id === levelId ? 'bold' : 'normal' }}>
                                        {level.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Grid>
            )}
        
            <Grid item xs={12} sm={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom>
                    Slides for {selectedLevel?.title}
                </Typography>
                {slides.length > 0 ? (
                    <Box sx={{ flexGrow: 1 }}>
                        <SlideContent slide={currentSlide} language={course.language} theme={theme} />
                        {currentQuestions.length > 0 && (
                            <Question
                                question={currentQuestions[0]}
                                userAnswer={userAnswer}
                                handleAnswerSelect={handleAnswerSelect}
                                isCorrect={isCorrect}
                                language={course.language}
                                syntaxHighlighterStyle={theme.palette.mode === 'dark' ? gruvboxDark : coldarkCold}
                            />
                        )}
                        <NavigationButtons
                            onPrevious={previousSlide}
                            onNext={nextSlide}
                            isNextDisabled={isCorrect == null}
                            nextButtonText={getNextButtonText()}
                            isFirstSlide={currentSlideIndex === 0} 
                        />
                    </Box>
                ) : (
                    <Typography>No slides available for this level.</Typography>
                )}
            </Grid>
        </Grid>
        

        </Box>
    );
};

export default LevelDetail;

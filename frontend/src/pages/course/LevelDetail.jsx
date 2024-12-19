import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { completeCourse, completeLevel, fetchCourseById } from '../../services/courses';
import { Box, Typography, Grid, CircularProgress, IconButton, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LevelDrawer from '../../shared/Course/client/LevelDrawer';
import SlideContent from '../../shared/Course/client/SlideContent'
import Question from '../../shared/Course/client/Question';
import NavigationButtons from '../../shared/Course/client/NavigationButtons';
import { gruvboxDark, coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { checkLogin } from '../../services/users';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';
import HourglassLoader from '../../shared/Loaders/Components/Hamster';

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
    const topSlideRef = useRef(null);


    const CurrentUser = checkLogin()
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

    const allPreviousLevelsCompleted = (levelIndex) => {
        return course.levels
            .slice(0, levelIndex) // Get all previous levels
            .every(level => isLevelCompletedByUser(level)); // Check if each is completed
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', }}>
                <HourglassLoader />
            </Box>
        );
    }

    if (error) return <Typography color="error">Error: {error}</Typography>;

    const selectedLevel = course.levels.find(level => level._id === levelId);
    const slides = selectedLevel ? selectedLevel.slides : [];
    const currentSlide = slides[currentSlideIndex];
    const currentQuestions = currentSlide?.sections?.reduce((acc, section) => {
        // Combine all questions from each section
        return acc.concat(section.questions || []);
    }, []) || []; // Default to an empty array if no questions are found
    
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

    const isLevelCompletedByUser = (level) => {
        return level.completedByUsers.some(user => user.userId == CurrentUser.id);
    };

    const nextSlide = async () => {
        if (currentSlideIndex < slides.length - 1) {
            // Move to the next slide
            setCurrentSlideIndex(currentSlideIndex + 1);
            setUserAnswer('');
            setIsCorrect(null);
            isMobile ? topSlideRef.current.scrollIntoView({ behavior: 'instant' }) : window.scrollTo({ top: 0, behavior: 'instant' });

        } else {
            // At the last slide of the current level
            const currentLevelIndex = course.levels.findIndex(level => level._id === levelId);
            try {
                // Complete the current level
                await completeLevel(levelId, CurrentUser.id);

                // Check if this is the last level
                if (currentLevelIndex < course.levels.length - 1) {
                    // Move to the next level
                    const nextLevelId = course.levels[currentLevelIndex + 1]._id;
                    setCurrentSlideIndex(0);
                    setUserAnswer('');
                    setIsCorrect(null);
                    window.location.href = `/course/${courseId}/level/${nextLevelId}`;
                } else {
                    // Check if all levels are completed before completing the course
                    const allLevelsCompleted = course.levels
                        .filter(level => level._id !== levelId) // Exclude current level
                        .every(level =>
                            level.completedByUsers.some(user => user.userId === CurrentUser.id)
                        );

                    if (allLevelsCompleted) {
                        // Complete the course if all levels are completed
                        await completeCourse(courseId, CurrentUser.id);
                        alert("Course completed!");
                        window.location.href = `/profile`;

                    } else {

                    }
                }
            } catch (error) {
                console.error('Error completing level:', error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const previousSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
            setUserAnswer('');
            setIsCorrect(null);
            isMobile ? topSlideRef.current.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' });

        }
    };


    const handleAnswerSelect = (answer) => {
        setUserAnswer(answer);
        const isAnswerCorrect = currentQuestions.some(q => q.correctAnswers.includes(answer));
        if (isAnswerCorrect) {
            setIsCorrect(isAnswerCorrect)
        }
        else {
            setIsCorrect(false)
        }
    };

    return (
        <Box sx={{ padding: 5, marginBottom: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isMobile && (
                <>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {course.title}
                    </Typography>

                </>
            )}

            <LevelDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                course={course}
                Level={levelId}
                setCurrentSlideIndex={setCurrentSlideIndex}
                setUserAnswer={setUserAnswer}
                setIsCorrect={setIsCorrect}
                CurrentUser={CurrentUser.id}
            />

            <Grid container spacing={2} sx={{ flexGrow: 1, height: '100%', }}>
                {!isMobile && (
                    <Grid
                        ref={topSlideRef}
                        item xs={12} sm={3} sx={{ bgcolor: theme.palette.background.paper, padding: 2, borderRadius: 2, }}>
                        <Typography variant="h4" marginBottom="25px" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            {course.title}
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Levels
                        </Typography>
                        {course.levels.map((level, index) => (
                            <Link
                                key={level._id}
                                to={allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? `/course/${courseId}/level/${level._id}` : '#'}
                                style={{ textDecoration: 'none', pointerEvents: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 'auto' : 'none', opacity: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 1 : 0.5 }}
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
                                        backgroundColor: level._id === levelId ? (theme.palette.mode === 'dark' ? '#444' : '#e0e0e0') : 'inherit',
                                        pointerEvents: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 'auto' : 'none',
                                        opacity: allPreviousLevelsCompleted(index) || isLevelCompletedByUser(level) ? 1 : 0.5,
                                    }}
                                >
                                    <CardContent sx={{ position: 'relative', minHeight: 80 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: level._id === levelId ? 'bold' : 'normal' }}
                                        >
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
                    </Grid>
                )}

                <Grid id='TopSlide' item xs={12} sm={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column', }}>
                    <Box ref={isMobile ? topSlideRef : null}
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                        <Typography variant="h5" gutterBottom>
                            Slides for {selectedLevel?.title}
                        </Typography>


                        {!isMobile &&
                            <Typography  variant="subtitle1" sx={{
                                color: theme.palette.text.secondary,
                                bgcolor: theme.palette.background.paper,
                                width: '150px',
                                padding: '8px',
                                borderRadius: 1,
                                textAlign: 'center', // Center align text within the box
                            }}>
                                Slide {currentSlideIndex + 1} of {slides.length}
                            </Typography>
                        }
                    </Box>
                    {isMobile &&
                        <div
                            style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            <IconButton

                                onClick={() => setDrawerOpen(true)}
                                sx={{
                                    mb: 1,
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: 1,
                                    '&:hover': { bgcolor: theme.palette.action.hover },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    padding: '8px',
                                    width: '150px'
                                }}
                            >
                                <MenuIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">Show Levels</Typography>
                            </IconButton>
                            <Typography variant="subtitle1" gutterBottom sx={{
                                color: theme.palette.text.secondary,
                                bgcolor: theme.palette.background.paper,
                                width: '150px',
                                padding: '8px',
                                borderRadius: 1,
                                mb: 1,
                                alignItems: 'center',
                            }}>
                                Slide {currentSlideIndex + 1} of {slides.length}
                            </Typography>
                        </div>
                    }
                    {slides.length > 0 ? (
                        <Box sx={{ flexGrow: 1 }}>
                           <SlideContent slide={currentSlide} language={course.language.toLowerCase()} theme={theme} />
                            {currentQuestions.length > 0 && (
                                <Question
                                    question={currentQuestions[0]}
                                    userAnswer={userAnswer}
                                    handleAnswerSelect={handleAnswerSelect}
                                    isCorrect={isCorrect}
                                    language={course.language.toLowerCase()}
                                    syntaxHighlighterStyle={theme.palette.mode === 'dark' ? gruvboxDark : coldarkCold}
                                />
                            )}

                            <NavigationButtons
                                onPrevious={previousSlide}
                                allow={currentQuestions.length > 0 ? false : true}
                                onNext={nextSlide}
                                isNextDisabled={isCorrect}
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

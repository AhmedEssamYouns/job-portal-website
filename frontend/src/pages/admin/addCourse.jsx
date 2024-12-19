import React, { useState } from 'react';
import {
    TextField, Button, Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails,
    IconButton, Divider, CircularProgress, Snackbar, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addCourse } from '../../services/courses';

const AddCoursePage = () => {
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        language: '',
        levels: [],
    });
    const [newLevelTitle, setNewLevelTitle] = useState('');
    const [editing, setEditing] = useState({ type: null, levelIndex: null, slideIndex: null, sectionIndex: null });
    const [slideInputs, setSlideInputs] = useState({});
    const [newQuestion, setNewQuestion] = useState({ questionText: '', options: ['', ''], correctAnswers: [], code: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [showAddQuestionIndex, setShowAddQuestionIndex] = useState(null);

    const handleAddLevel = () => {
        setCourseData(prevData => ({
            ...prevData,
            levels: [...prevData.levels, { title: newLevelTitle, slides: [] }]
        }));
        setNewLevelTitle('');
    };

    const handleAddSlide = (levelIndex) => {
        setCourseData(prevData => {
            const updatedLevels = [...prevData.levels];
            updatedLevels[levelIndex].slides.push({ sections: [] });
            return { ...prevData, levels: updatedLevels };
        });
        setSlideInputs(prev => ({ ...prev, [`${levelIndex}-newSection`]: { content: '', code: '' } }));
    };

    const handleAddSection = (levelIndex, slideIndex) => {
        const { content, code } = slideInputs[`${levelIndex}-${slideIndex}`] || { content: '', code: '' };
        if (content || code) {
            setCourseData(prevData => {
                const updatedLevels = [...prevData.levels];
                updatedLevels[levelIndex].slides[slideIndex].sections.push({ content, code, questions: [] });
                return { ...prevData, levels: updatedLevels };
            });
            setSlideInputs(prev => ({ ...prev, [`${levelIndex}-${slideIndex}`]: { content: '', code: '' } }));
        }
    };
    const handleAddQuestion = (levelIndex, slideIndex) => {
        setCourseData(prevData => {
            const updatedLevels = [...prevData.levels];

            // Prepare new section data
            const newSection = {
                content: slideInputs[`${levelIndex}-${slideIndex}`]?.content || '',
                code: slideInputs[`${levelIndex}-${slideIndex}`]?.code || '',
                questions: [{
                    questionText: newQuestion.questionText,
                    type: 'mcq',
                    options: newQuestion.options,
                    correctAnswers: newQuestion.correctAnswers,
                    code: newQuestion.code
                }]
            };

            // Add the new section to the target slide
            updatedLevels[levelIndex].slides[slideIndex].sections.push(newSection);

            return { ...prevData, levels: updatedLevels };
        });

        // Reset input fields and state
        setNewQuestion({ questionText: '', options: ['', ''], correctAnswers: [], code: '' });
        setSlideInputs(prev => ({ ...prev, [`${levelIndex}-${slideIndex}`]: { content: '', code: '' } }));
        setShowAddQuestion(false);
        setShowAddQuestionIndex(null);
    };

    const handleAddOption = () => {
        setNewQuestion(prev => ({ ...prev, options: [...prev.options, ''] }));
    };

    const handleOptionChange = (index, value) => {
        setNewQuestion(prev => {
            const updatedOptions = [...prev.options];
            updatedOptions[index] = value;
            return { ...prev, options: updatedOptions };
        });
    };

    const handleCorrectAnswerToggle = (option) => {
        setNewQuestion(prev => {
            const isCorrect = prev.correctAnswers.includes(option);
            const updatedCorrectAnswers = isCorrect
                ? prev.correctAnswers.filter(answer => answer !== option)
                : [...prev.correctAnswers, option];
            return { ...prev, correctAnswers: updatedCorrectAnswers };
        });
    };

    const handleDeleteLevel = (levelIndex) => {
        setCourseData(prevData => {
            const updatedLevels = prevData.levels.filter((_, index) => index !== levelIndex);
            return { ...prevData, levels: updatedLevels };
        });
    };

    const handleDeleteSlide = (levelIndex, slideIndex) => {
        setCourseData(prevData => {
            const updatedLevels = [...prevData.levels];
            updatedLevels[levelIndex].slides.splice(slideIndex, 1);
            return { ...prevData, levels: updatedLevels };
        });
    };

    const handleDeleteSection = (levelIndex, slideIndex, sectionIndex) => {
        setCourseData(prevData => {
            const updatedLevels = [...prevData.levels];
            updatedLevels[levelIndex].slides[slideIndex].sections.splice(sectionIndex, 1);
            return { ...prevData, levels: updatedLevels };
        });
    };

    const handleEditToggle = (type, levelIndex, slideIndex = null, sectionIndex = null) => {
        setEditing({ type, levelIndex, slideIndex, sectionIndex });
    };

    const handleSave = (levelIndex, slideIndex) => {
        setEditing({ type: null, levelIndex: null, slideIndex: null, sectionIndex: null });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const handleSectionInputChange = (levelIndex, slideIndex, field, value) => {
        setSlideInputs(prev => ({
            ...prev,
            [`${levelIndex}-${slideIndex}`]: { ...(prev[`${levelIndex}-${slideIndex}`] || {}), [field]: value }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await addCourse(courseData);
            setLoading(false);
            setAlert({ open: true, message: 'Course added successfully!', severity: 'success' });
            setCourseData({ title: '', description: '', language: '', levels: [] });
        } catch (error) {
            setLoading(false);
            setAlert({ open: true, message: `Failed to add course: ${error.message}`, severity: 'error' });
        }
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 2 }}>
            <Typography variant="h4" gutterBottom>Add New Course</Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField
                    fullWidth
                    label="Course Title"
                    name="title"
                    required
                    value={courseData.title}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    required
                    label="Description"
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    required
                    fullWidth
                    label="Language"
                    name="language"
                    value={courseData.language}
                    onChange={handleInputChange}
                    margin="normal"
                />

                <Box mt={3}>
                    <Typography variant="h6">Levels</Typography>
                    {courseData.levels.map((level, levelIndex) => (
                        <Accordion key={levelIndex}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{level.title}</Typography>
                                <IconButton onClick={() => handleDeleteLevel(levelIndex)} size="small" color="error">
                                    <DeleteIcon />
                                </IconButton>
                                {editing.type === 'level' && editing.levelIndex === levelIndex ? (
                                    <>
                                        <TextField
                                            fullWidth
                                            label="Edit Level Title"
                                            value={level.title}
                                            onChange={(e) =>
                                                setCourseData(prevData => {
                                                    const updatedLevels = [...prevData.levels];
                                                    updatedLevels[levelIndex].title = e.target.value;
                                                    return { ...prevData, levels: updatedLevels };
                                                })
                                            }
                                            margin="normal"
                                        />
                                        <Button onClick={() => handleSave(levelIndex)} color="primary">
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <IconButton onClick={() => handleEditToggle('level', levelIndex)} size="small" color="primary">
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </AccordionSummary>
                            <AccordionDetails>

                                {level.slides.map((slide, slideIndex) => (
                                    <Accordion key={slideIndex} sx={{ mt: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Slide {slideIndex + 1}</Typography>
                                            <IconButton
                                                onClick={() => handleDeleteSlide(levelIndex, slideIndex)}
                                                size="small"
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {slide.sections.map((section, sectionIndex) => (
                                                <Box key={sectionIndex} display="flex" flexDirection="column" mb={1}>
                                                    <TextField
                                                        label="Content"
                                                        value={section.content}
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="dense"
                                                        InputProps={{ readOnly: true }}
                                                        multiline
                                                    />
                                                    <TextField
                                                        label="Code"
                                                        value={section.code}
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="dense"
                                                        sx={{ mt: 1 }}
                                                        InputProps={{ readOnly: true }}
                                                        multiline
                                                    />
                                                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                                        Questions
                                                    </Typography>
                                                    {section.questions?.map((q, qIndex) => (
                                                        <Box key={qIndex} mt={1}>
                                                            <Typography variant="body1">
                                                                {q.questionText}
                                                            </Typography>

                                                            {/* Display code if it exists */}
                                                            {q.code && (
                                                                <Box mt={1} p={1} bgcolor="#f0f0f0" borderRadius="4px">
                                                                    <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'monospace' }}>
                                                                        {q.code}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Map through options and color correct answers green */}
                                                            {q.options.map((option, oIndex) => (
                                                                <Typography
                                                                    key={oIndex}
                                                                    variant="body2"
                                                                    style={{
                                                                        color: q.correctAnswers.includes(option) ? 'green' : 'inherit',
                                                                        fontWeight: q.correctAnswers.includes(option) ? 'bold' : 'normal'
                                                                    }}
                                                                >
                                                                    {option}
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    ))}




                                                </Box>
                                            ))}
                                            <Box display="flex" flexDirection="column" mt={2}>
                                                <Box display="flex">
                                                    <TextField
                                                        fullWidth
                                                        label="Section Content"
                                                        value={slideInputs[`${levelIndex}-${slideIndex}`]?.content || ''}
                                                        onChange={(e) => handleSectionInputChange(levelIndex, slideIndex, 'content', e.target.value)}
                                                        margin="normal"
                                                        multiline
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Code Example"
                                                        value={slideInputs[`${levelIndex}-${slideIndex}`]?.code || ''}
                                                        onChange={(e) => handleSectionInputChange(levelIndex, slideIndex, 'code', e.target.value)}
                                                        margin="normal"
                                                        sx={{ ml: 1 }}
                                                        multiline
                                                    />
                                                </Box>
                                                <Button
                                                    onClick={() => {
                                                        setShowAddQuestion(prev => !prev);  // Toggle showAddQuestion state
                                                    }}
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{ mt: 2 }}
                                                >
                                                    {showAddQuestion ? 'Close' : 'Open'} Question Form
                                                </Button>

                                                {showAddQuestion && (
                                                    <>
                                                        <Box display="flex" flexDirection="column" mt={2}>
                                                            <TextField
                                                                fullWidth
                                                                label="New Question"
                                                                value={newQuestion.questionText}
                                                                onChange={(e) =>
                                                                    setNewQuestion(prev => ({ ...prev, questionText: e.target.value }))
                                                                }
                                                                margin="dense"
                                                                multiline
                                                            />
                                                            <TextField
                                                                fullWidth
                                                                label="Code (optional)"
                                                                value={newQuestion.code}
                                                                onChange={(e) =>
                                                                    setNewQuestion(prev => ({ ...prev, code: e.target.value }))
                                                                }
                                                                margin="dense"
                                                                multiline
                                                                sx={{ mt: 1 }}
                                                            />
                                                            {newQuestion.options.map((option, oIndex) => (
                                                                <TextField
                                                                    key={oIndex}
                                                                    fullWidth
                                                                    label={`Option ${oIndex + 1}`}
                                                                    value={option}
                                                                    onChange={(e) => handleOptionChange(oIndex, e.target.value)}
                                                                    margin="dense"
                                                                    sx={{ mt: 1 }}
                                                                />
                                                            ))}
                                                            <Button
                                                                onClick={handleAddOption}
                                                                startIcon={<AddIcon />}
                                                                color="secondary"
                                                                variant="text"
                                                                sx={{ mt: 1 }}
                                                            >
                                                                Add Option
                                                            </Button>
                                                            <Box mt={1}>
                                                                {newQuestion.options.map((option, oIndex) => (
                                                                    <Button
                                                                        key={oIndex}
                                                                        onClick={() => handleCorrectAnswerToggle(option)}
                                                                        color={
                                                                            newQuestion.correctAnswers.includes(option)
                                                                                ? 'primary'
                                                                                : 'inherit'
                                                                        }
                                                                        variant={
                                                                            newQuestion.correctAnswers.includes(option)
                                                                                ? 'contained'
                                                                                : 'outlined'
                                                                        }
                                                                        sx={{ mr: 1 }}
                                                                    >
                                                                        {option}
                                                                    </Button>
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                        <Button
                                                            onClick={() => handleAddQuestion(levelIndex, slideIndex)}
                                                            color="secondary"
                                                            variant="outlined"
                                                            sx={{ mt: 2 }}
                                                            disabled={!newQuestion.options.length || !newQuestion.correctAnswers.length}
                                                        >
                                                            Save Question and Add New Section
                                                        </Button>
                                                    </>
                                                )}


                                            </Box>
                                            <Button
                                                onClick={() => handleAddSection(levelIndex, slideIndex)}
                                                startIcon={<AddIcon />}
                                                color="secondary"
                                                variant="outlined"
                                                sx={{ mt: 1 }}
                                            >
                                                Add Section
                                            </Button>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddSlide(levelIndex)}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{ mt: 1 }}
                                >
                                    Add Slide
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    <Box display="flex" alignItems="center" mt={3}>
                        <TextField
                            fullWidth
                            label="New Level Title"
                            value={newLevelTitle}
                            onChange={(e) => setNewLevelTitle(e.target.value)}
                            margin="normal"
                        />
                        <Button
                            onClick={handleAddLevel}
                            startIcon={<AddIcon />}
                            color="primary"
                            disabled={newLevelTitle == '' ? true : false}
                            variant="contained"
                            sx={{ ml: 2, height: '56px' }}
                        >
                            Add Level
                        </Button>
                    </Box>
                </Box>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Submit Course'}
                </Button>
            </Box>
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddCoursePage;
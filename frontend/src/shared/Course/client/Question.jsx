import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// Function to format text with ** as bold
const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/); // Split by bold markers
    return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={index}>
                    {part.slice(2, -2)} {/* Remove the ** markers */}
                </strong>
            );
        }
        return part;
    });
};

const Question = ({ question, userAnswer, handleAnswerSelect, isCorrect, language, syntaxHighlighterStyle }) => {
    const theme = useTheme();

    const buttonStyles = {
        light: {
            background: '#f0f0f0',
            color: '#000',
            hover: '#e0e0e0',
            selected: '#1976d2',
        },
        dark: {
            background: '#333',
            color: '#fff',
            hover: '#555',
            selected: '#1976d2',
        },
    };

    const currentMode = theme.palette.mode === 'dark' ? 'dark' : 'light';
    const colors = buttonStyles[currentMode];

    const isSelected = (option) => userAnswer === option;

    const renderOptions = () => {
        return question.options
            .filter(option => option.trim() !== '')
            .map((option, optionIndex) => {
                const isOptionSelected = isSelected(option);

                return (
                    <Button
                        key={optionIndex}
                        variant={isOptionSelected ? "contained" : "outlined"}
                        onClick={() => handleAnswerSelect(option)}
                        sx={{
                            marginBottom: 2,
                            maxWidth: '500px',
                            width: '100%',
                            textTransform: 'none',
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            backgroundColor: isOptionSelected ? colors.selected : colors.background,
                            color: isOptionSelected ? '#fff' : colors.color,
                            '&:hover': {
                                backgroundColor: isOptionSelected ? colors.selected : colors.hover,
                            },
                            '&:focus': {
                                outline: 'none',
                                boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
                            },
                        }}
                    >
                        {String.fromCharCode(65 + optionIndex) + ". " + option}
                    </Button>
                );
            });
    };

    return (
        <Box mt={2} sx={{ textAlign: 'center', borderTop: 1, paddingTop: 2 }}>
            <Typography variant="h5" gutterBottom>
                {formatText(question.questionText)} {/* Render formatted text */}
            </Typography>

            {question.code && (
                <SyntaxHighlighter language={language} style={syntaxHighlighterStyle}>
                    {question.code}
                </SyntaxHighlighter>
            )}

            <div style={{ height: '15px' }}></div>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {renderOptions()}
            </Box>

            {isCorrect !== null && (
                <Typography color={isCorrect ? "green" : "red"} mt={2}>
                    {isCorrect ? "Correct!" : "Try again!"}
                </Typography>
            )}
        </Box>
    );
};

export default Question;

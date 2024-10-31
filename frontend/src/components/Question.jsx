import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const Question = ({ question, userAnswer, handleAnswerSelect, isCorrect, language, syntaxHighlighterStyle }) => {
    const theme = useTheme();

    // Define custom colors based on the current theme
    const buttonStyles = {
        light: {
            background: '#f0f0f0', // Light mode button background
            color: '#000', // Light mode text color
            hover: '#e0e0e0', // Light mode hover color
            selected: '#1976d2', // Primary color for selected button
        },
        dark: {
            background: '#333', // Dark mode button background
            color: '#fff', // Dark mode text color
            hover: '#555', // Dark mode hover color
            selected: '#1976d2', // Primary color for selected button
        },
    };

    const currentMode = theme.palette.mode === 'dark' ? 'dark' : 'light';
    const colors = buttonStyles[currentMode];

    return (
        <Box mt={2} sx={{ textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
                {question.questionText}
            </Typography>

            {question.code && (
                <SyntaxHighlighter language={language} style={syntaxHighlighterStyle}>
                    {question.code}
                </SyntaxHighlighter>
            )}
            <div style={{ height: '15px' }}></div>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {question.options.map((option, optionIndex) => (
                    <Button
                        key={optionIndex}
                        variant={userAnswer === option ? "contained" : "outlined"}
                        onClick={() => handleAnswerSelect(option)}
                        sx={{
                            marginBottom: 2,
                            maxWidth: '500px', // Set a maximum width
                            width: '100%', // Make the width responsive
                            textTransform: 'none',
                            textAlign: 'left',
                            justifyContent: 'flex-start', // Center text within the button
                            backgroundColor: userAnswer === option ? colors.selected : colors.background,
                            color: userAnswer === option ? '#fff' : colors.color,
                            '&:hover': {
                                backgroundColor: userAnswer === option ? colors.selected : colors.hover,
                            },
                            '&:focus': {
                                outline: 'none', // Remove default focus outline
                                boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`, // Add custom focus outline
                            },
                        }}
                    >
                        {String.fromCharCode(65 + optionIndex) + ". " + option} {/* A, B, C, ... */}
                    </Button>
                ))}
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

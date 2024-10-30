import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const Question = ({ question, userAnswer, handleAnswerSelect, isCorrect, language, syntaxHighlighterStyle }) => {
    return (
        <Box mt={2}>
            <Typography variant="body1" gutterBottom>
                {question.questionText}
            </Typography>

            {question.code && (
                <SyntaxHighlighter language={language} style={syntaxHighlighterStyle}>
                    {question.code}
                </SyntaxHighlighter>
            )}
            <div style={{height:'15px'}}></div>
            {question.options.map((option, optionIndex) => (
                <Button
                    key={optionIndex}
                    variant={userAnswer === option ? "contained" : "outlined"}
                    onClick={() => handleAnswerSelect(option)}
                    sx={{ marginRight: 1, mb: 1 }}
                >
                    {option}
                </Button>
            ))}
            {isCorrect !== null && (
                <Typography color={isCorrect ? "green" : "red"}>
                    {isCorrect ? "Correct!" : "Try again!"}
                </Typography>
            )}
        </Box>
    );
};

export default Question;

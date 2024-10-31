import React from 'react';
import { Box } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark, coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SlideContent = ({ slide, language, theme }) => {
    return (
        <Box>
            {/* Iterate over the content and code together */}
            {slide.content.map((text, index) => (
                <Box key={index} mb={2}>
                    <pre>
                        <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
                    </pre>
                    {/* Display corresponding code for the current content */}
                    {slide.code[index] && (
                        <SyntaxHighlighter language={language} style={theme.palette.mode === 'dark' ? gruvboxDark : coldarkCold}>
                            {slide.code[index]}
                        </SyntaxHighlighter>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default SlideContent;

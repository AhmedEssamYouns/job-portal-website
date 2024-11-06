import React from 'react';
import { Box } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark, coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Function to make **text** bold
const formatText = (text) => {
    // Replace any text wrapped in ** with <strong> to make it bold
    return text.split('**').map((part, index) => {
        if (index % 2 !== 0) {
            // Make every second part bold
            return <strong key={index}>{part}</strong>;
        }
        return part;
    });
};

const SlideContent = ({ slide, language, theme }) => {
    return (
        <Box>
            {/* Iterate over the sections array */}
            {slide.sections.map((section, index) => (
                <Box key={index} mb={2}>
                    {/* Display formatted content text */}
                    <pre>
                        {section.content &&
                            <span style={{ whiteSpace: 'pre-wrap' }}>
                                {formatText(section.content)}
                            </span>
                        }
                    </pre>

                    {/* Display code snippet if present */}
                    {section.code && (
                        <SyntaxHighlighter language={language} style={theme.palette.mode === 'dark' ? gruvboxDark : coldarkCold}>
                            {section.code}
                        </SyntaxHighlighter>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default SlideContent;

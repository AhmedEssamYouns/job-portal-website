import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark, coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Function to make **text** bold and ##text## have a light grey background
const formatText = (text,isDarkMode) => {
    // Split the text into parts
    const parts = text.split(/(\*\*[^*]+\*\*|##[^#]+##)/g);

    return parts.map((part, index) => {
        // If the part is wrapped in **, make it bold
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        // If the part is wrapped in ##, give it a light grey background
        if (part.startsWith('##') && part.endsWith('##')) {
            return (
                <span key={index} style={{ backgroundColor: isDarkMode ? '#6666' : '#e0e0e0', padding:2,borderRadius:5,margin:2 }}>
                    {part.slice(2, -2)}
                </span>
            );
        }
        return part;
    });
};

const SlideContent = ({ slide, language, theme }) => {
    const isDarkMode = theme.palette.mode === 'dark';
    return (
        <Box>
            {/* Iterate over the sections array */}
            {slide.sections.map((section, index) => (
                <Box key={index} mb={2}>
                    {/* Display formatted content text */}
                    <pre>
                        {section.content && (
                            <span style={{ whiteSpace: 'pre-wrap' }}>
                                {formatText(section.content,isDarkMode)}
                            </span>
                        )}
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

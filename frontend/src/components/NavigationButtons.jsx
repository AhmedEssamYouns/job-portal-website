import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const NavigationButtons = ({ onPrevious, onNext, isNextDisabled, nextButtonText, isFirstSlide }) => {
    return (
        <Box display="flex" justifyContent="space-between" mt={2}>
            {!isFirstSlide && (
                <Button onClick={onPrevious} startIcon={<ArrowBackIcon />}>
                    Previous Slide
                </Button>
            )}
            <Button onClick={onNext} disabled={isNextDisabled}>
                {nextButtonText} <ArrowForwardIcon />
            </Button>
        </Box>
    );
};

export default NavigationButtons;

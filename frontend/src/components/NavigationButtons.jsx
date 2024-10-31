import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const NavigationButtons = ({ onPrevious, onNext, isNextDisabled, nextButtonText, isFirstSlide }) => {
    const disabled = isNextDisabled === false ? true : isNextDisabled === null;
    return (
        <Box display="flex" justifyContent="space-between" mt={2}>
            {!isFirstSlide && (
                <Button onClick={onPrevious}>
                    Previous Slide
                </Button>
            )}
            <Button onClick={onNext} disabled={disabled}>
                {nextButtonText}
            </Button>
        </Box>
    );
};

export default NavigationButtons;

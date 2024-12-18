import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

const NavigationButtons = ({ onPrevious, onNext, isNextDisabled, nextButtonText, isFirstSlide, allow }) => {

    const disabled = allow ? false : (isNextDisabled === false ? true : isNextDisabled === null)
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

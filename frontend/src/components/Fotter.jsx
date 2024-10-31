import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                padding: '16px',
                position: 'relative',
                bottom: 0,
                width: '100%',
                textAlign: 'center',
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Typography variant="body2">
                Created by <strong>Ahmed Essam</strong>
            </Typography>
        </Box>
    );
};

export default Footer;

import React, { useState } from 'react'; // Import useState
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  Snackbar, 
  Alert,
  Grid, 
} from '@mui/material';
import { keyframes } from '@emotion/react';
import RobotLoader from '../../shared/Loaders/Components/Robot';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const HomePage = () => {
  const theme = useTheme(); 
  const isMobile = useMediaQuery('(max-width:970px)');
  const [email, setEmail] = useState(''); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 

  const handleSubscribe = (e) => {
    e.preventDefault(); 
  
    if (!email) return; 
  
    setOpenSnackbar(true);
    setEmail(''); 
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container sx={{ marginTop: isMobile ? 1 : 7, minHeight: '100vh' }}>
      <Box
        sx={{
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
              : 'linear-gradient(135deg, #0d47a1, #1565c0)',
          padding: 6,
          borderRadius: 4,
          marginBottom: 4,
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                animation: `${fadeIn} 1.5s ease-out`,
                marginBottom: { xs: 2, md: 0 },
              }}
            >
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  color: theme.palette.mode === 'light' ? '#fff' : '#bbdefb',
                  animation: `${bounce} 2s infinite`,
                }}
              >
                Welcome to <span style={{
                  fontFamily: 'tiny5',
                  animation: `${bounce} 2s infinite`,
                }} >CodeQuest</span>
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : '#90caf9',
                }}
                gutterBottom
              >
                Discover programming courses, track your progress, and unlock new skills.
              </Typography>
              <Link to="/courses" style={{ textDecoration: 'none' }}> 
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    marginTop: 2,
                    animation: `${bounce} 2s infinite`,
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <RobotLoader />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          borderRadius: 4,
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9' }}
        >
          Subscribe Now
        </Typography>
        <Typography
          variant="body1"
          color={theme.palette.mode === 'light' ? 'textSecondary' : '#b0bec5'}
          gutterBottom
        >
          Stay updated with the latest courses and challenges.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubscribe} // Handle form submission
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            marginTop: 2,
          }}
        >
          <TextField
            label="Enter your email"
            variant="outlined"
            size="small"
            value={email} // Bind email state to TextField
            onChange={(e) => setEmail(e.target.value)} // Update email state
            sx={{ width: { xs: '100%', sm: '300px' } }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ animation: `${bounce} 2s infinite` }}
            type="submit" // Ensure button submits the form
          >
            Subscribe
          </Button>
        </Box>
      </Box>

      {/* Snackbar for subscription success */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Subscribed successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;

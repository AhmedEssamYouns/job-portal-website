import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  useTheme,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import RobotLoader from '../components/Robot';

// Keyframe animation for the welcome message
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

// Button hover animation
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const HomePage = () => {
  const theme = useTheme(); // Access theme to detect light or dark mode

  return (
    <Container sx={{ marginTop: 8, minHeight: '100vh' }}>
      {/* Hero Section */}
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
          {/* Welcome Text Section */}
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
                sx={{ color: theme.palette.mode === 'light' ? '#fff' : '#bbdefb' }}
              >
                Welcome to <span style={{ fontFamily:'tiny5' }}>CodeQuest</span>
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
            </Box>
          </Grid>

          {/* Robot Animation Section */}
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <RobotLoader />
          </Grid>
        </Grid>
      </Box>

      {/* Subscribe Now Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? '#e3f2fd' : '#1e1e1e',
          padding: 4,
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
            sx={{ width: { xs: '100%', sm: '300px' } }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ animation: `${bounce} 2s infinite` }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;

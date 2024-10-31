import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Popover, MenuItem, TextField, useMediaQuery, Box, Slide, Typography } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { logout, checkLogin } from '../api/users';
import ToggleButton from './ToggleButton';
const Navbar = () => {
    const { toggleTheme } = useThemeContext();
    const user = checkLogin()
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false); // State to handle search bar visibility
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const toggleSearch = () => {
        setShowSearch((prev) => !prev); // Toggle the search bar
        if (showSearch) {
            setSearchQuery(""); // Clear the search query when closing
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const handleLogout = () => {
        logout();
    };
    return (
        <AppBar position="static" style={{
            background:
                theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                    : 'linear-gradient(95deg, #0d47a1, #1565c0)'
        }}>
            <Toolbar>
                {!showSearch &&
                    <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Typography variant="h4" sx={{ color: theme.palette.common.white, fontFamily: "Tiny5", }}>
                            CodeQuest
                        </Typography>
                    </Box>
                }

                {/* Responsive Search Bar */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {isMobile && !showSearch ? (
                        <IconButton color="inherit" onClick={toggleSearch}>
                            <SearchIcon />
                        </IconButton>
                    ) : (
                        <Slide direction="right" in={showSearch} mountOnEnter >
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                sx={{
                                    marginLeft: 2,
                                    marginRight: 2,
                                    borderRadius: 1,
                                    backgroundColor: theme.palette.background.paper,
                                    width: '90%', // Fixed width for desktop
                                }}
                            />
                        </Slide>
                    )}

                    {showSearch && (
                        <IconButton color="inherit" onClick={toggleSearch}>
                            <CloseIcon />
                        </IconButton>
                    )}
                    {!isMobile &&
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{
                                marginLeft: 2,
                                marginRight: 2,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: 10,
                                width: '300px',
                            }}
                            InputProps={{
                                sx: {
                                    borderRadius: 10,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none', // Remove the default border
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        border: 'none', // Remove the border on hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: 'none', // Remove the border when focused
                                    },
                                },
                            }}
                        />

                    }
                    {!showSearch && <>
                        <IconButton color="inherit" component={Link} to="/jobs">
                            <WorkIcon />
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/profile">
                            <AccountCircleIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                    </>
                    }
                </Box>

            </Toolbar>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={toggleTheme}>Change Theme</MenuItem>
                {user &&
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                }
            </Popover>
        </AppBar >
    );
};

export default Navbar;

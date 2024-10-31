import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Popover,
    MenuItem,
    TextField,
    useMediaQuery,
    Box,
    Slide,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material/styles';
import { logout, checkLogin } from '../api/users';
import { fetchCourses } from '../api/courses';

const Navbar = () => {
    const { toggleTheme } = useThemeContext();
    const user = checkLogin(); // Check if user is logged in
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false); // State to handle search bar visibility
    const [courses, setCourses] = useState([]); // State to hold fetched courses
    const [filteredCourses, setFilteredCourses] = useState([]); // State to hold filtered courses
    const [showDropdown, setShowDropdown] = useState(false); // State to show/hide dropdown
    const isMobile = useMediaQuery('(max-width:750px)');
    const navigate = useNavigate();

    useEffect(() => {
        const getCourses = async () => {
            const data = await fetchCourses();
            setCourses(data); // Assuming fetchCourses returns an array of course objects
        };

        getCourses();
    }, []);

    useEffect(() => {
        // Filter courses based on search query
        setFilteredCourses(courses.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [searchQuery, courses]);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchSubmit = (event) => {
        if (event.key === 'Enter') {
            // Navigate to the search results page with the query as a URL parameter
            navigate(`/search?q=${searchQuery}`);
            setShowDropdown(false); // Hide dropdown on submit
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setShowDropdown(true); // Show dropdown when typing
    };

    const toggleSearch = () => {
        setShowSearch((prev) => !prev); // Toggle the search bar
        if (showSearch) {
            setSearchQuery(''); // Clear the search query when closing
            setShowDropdown(false); // Hide dropdown when closing
        }
    };

    const handleDropdownItemClick = (title) => {
        setSearchQuery(title); // Set the clicked course title as the search query
        setShowDropdown(false); // Hide dropdown after selecting
        navigate(`/search?q=${title}`); // Navigate to the search results
    };

    const handleBlur = () => {
        setShowDropdown(false); // Hide dropdown on blur
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleLogout = () => {
        logout();
    };

    return (
        <AppBar
            position="sticky"
            style={{
                background:
                    theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                        : 'linear-gradient(95deg, #0d47a1, #1565c0)',
            }}
        >
            <Toolbar>
                {!showSearch && (
                    <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{ color: theme.palette.common.white, fontFamily: 'Tiny5' }}
                        >
                            CodeQuest
                        </Typography>
                    </Box>
                )}

                {/* Responsive Search Bar */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {isMobile && !showSearch && user ? (
                            <IconButton color="inherit" onClick={toggleSearch}>
                                <SearchIcon />
                            </IconButton>
                        ) : (
                            <Slide direction="right" in={showSearch} mountOnEnter>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Search jobs..."
                                    value={searchQuery}
                                    onKeyDown={handleSearchSubmit}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                                    onBlur={handleBlur} // Hide dropdown on blur
                                    sx={{
                                        marginLeft: 2,
                                        marginRight: 2,
                                        borderRadius: 1,
                                        backgroundColor: theme.palette.background.paper,
                                        width: '100%', // Set a fixed width for the TextField
                                    }}
                                />
                            </Slide>
                        )}

                        {showDropdown && isMobile && filteredCourses.length > 0 && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1,
                                    top: 46, // Positioning the dropdown below the TextField
                                    left: '45%', // Centering the dropdown
                                    transform: 'translateX(-50%)', // Centering it perfectly based on its width
                                    maxHeight: 120,
                                    overflowY: 'auto',
                                    zIndex: 1000,
                                    width: '70%', // Match the width of the TextField
                                }}
                            >
                                <List>
                                    {filteredCourses.map((course) => (
                                        <ListItem button key={course.id} onClick={() => handleDropdownItemClick(course.title)}>
                                            <ListItemText
                                                primary={course.title}
                                                sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} // Use sx for custom styling
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>


                    {showSearch && (
                        <IconButton color="inherit" onClick={toggleSearch}>
                            <CloseIcon />
                        </IconButton>
                    )}
                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        {!isMobile && (
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onKeyDown={handleSearchSubmit}
                                onChange={handleSearchChange}
                                onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                                onBlur={handleBlur} // Hide dropdown on blur
                                sx={{
                                    marginLeft: 2,
                                    marginRight: 2,
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: 10,
                                    width: '300px', // Fixed width for desktop
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
                        )}

                        {showDropdown && !isMobile && filteredCourses.length > 0 && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1,
                                    marginLeft: 2,
                                    top: 35,
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                    zIndex: 1000,
                                    marginTop: 1, // Ensure there's a little space between the TextField and dropdown
                                    width: '300px', // Match the width of the TextField
                                }}
                            >
                                <List>
                                    {filteredCourses.map((course) => (
                                        <ListItem button key={course.id} onClick={() => handleDropdownItemClick(course.title)}>
                                            <ListItemText
                                                primary={course.title}
                                                sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} // Use sx for custom styling
                                            />

                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>


                    {!user && !showSearch && (
                        <Box sx={{ display: 'flex', gap: isMobile ? 0 : 2 }}>
                            <Button
                                component={Link}
                                to="/courses"
                                color="inherit"
                            >
                                <SchoolIcon />
                            </Button>
                            <Button
                                component={Link}
                                to="/signin"
                                variant="outlined"
                                color="inherit"
                                sx={{ borderRadius: 10 }}
                            >
                                Sign In
                            </Button>
                            {!isMobile && (
                                <Button
                                    component={Link}
                                    to="/signup"
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 10 }}
                                >
                                    Sign Up
                                </Button>
                            )}

                        </Box>
                    )}


                    {!showSearch && user && (
                        <>
                            <IconButton color="inherit" component={Link} to="/courses">
                                <SchoolIcon />
                            </IconButton>
                            <IconButton color="inherit" component={Link} to="/profile">
                                <AccountCircleIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={handleMenuClick}>
                                <MenuIcon />
                            </IconButton>
                        </>
                    )}
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
                {user && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
            </Popover>
        </AppBar>
    );
};

export default Navbar;

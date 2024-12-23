import React, { useState, useEffect, useRef } from "react";
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
  Badge,
  Drawer,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { useThemeContext } from "../../context/ThemeContext";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import { useTheme } from "@mui/material/styles";
import { logout, checkLogin } from "../../services/users";
import { fetchCourses } from "../../services/courses";
import {
  AssignmentTurnedIn,
  CardGiftcard,
  CardGiftcardRounded,
  CardGiftcardTwoTone,
  MenuBook,
  ShoppingCartCheckoutOutlined,
} from "@mui/icons-material";
import { getCartItems, getCartItemsLength } from "../../utils/storage";
import {
  AccountCircle,
  ShoppingCart,
  Favorite,
  Brightness6,
  Lock,
  ExitToApp,
} from "@mui/icons-material";
const Navbar = () => {
  const { toggleTheme } = useThemeContext();
  const user = checkLogin();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const isMobile = useMediaQuery("(max-width:830px)");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [Total, setCartLength] = useState(getCartItemsLength());

  useEffect(() => {
    // Set interval to update the cart length every 500ms
    const intervalId = setInterval(() => {
      const currentCartLength = getCartItemsLength();
      setCartLength(currentCartLength); // Update the state with the current cart length
    }, 500);

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      const data = await fetchCourses();
      setCourses(data);
    };

    getCourses();
  }, []);

  useEffect(() => {
    if (Array.isArray(courses)) {
      setFilteredCourses(
        courses.filter((course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      console.error("courses is not an array:", courses);
    }
  }, [searchQuery, courses]);

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerClose = () => setOpenDrawer(false);
  const handleDrawerOpen = () => setOpenDrawer(true);

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?q=${searchQuery}`);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false); // Hide dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setShowDropdown(true);
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) {
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handleDropdownItemClick = (course) => {
    setSearchQuery(course.title);
    setShowDropdown(false);
    navigate(`/course/${course._id}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="sticky"
      style={{
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #1976d2, #42a5f5)"
            : "linear-gradient(95deg, #0d47a1, #1565c0)",
      }}
    >
      <Toolbar>
        {!showSearch && (
          <Box
            component={Link}
            to="/"
            sx={{ display: "flex", alignItems: "center", marginRight: 2 }}
          >
            <Typography
              sx={{
                color: theme.palette.common.white,
                fontFamily: "Tiny5",
                fontSize: isMobile ? "1.305rem" : "2.625rem",
              }}
            >
              CodeQuest
            </Typography>
          </Box>
        )}

        {/* Responsive Search Bar */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {isMobile && !showSearch && user ? (
              <IconButton color="inherit" onClick={toggleSearch}>
                <SearchIcon />
              </IconButton>
            ) : (
              <Slide direction="right" in={showSearch} mountOnEnter>
                <TextField
                  ref={inputRef}
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  value={searchQuery}
                  onKeyDown={handleSearchSubmit}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  sx={{
                    marginLeft: 2,
                    marginRight: 2,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    width: "100%",
                  }}
                />
              </Slide>
            )}

            {showDropdown && isMobile && filteredCourses.length > 0 && (
              <Box
                ref={dropdownRef}
                sx={{
                  position: "absolute",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  top: 46, // Positioning the dropdown below the TextField
                  left: "45%", // Centering the dropdown
                  transform: "translateX(-50%)", // Centering it perfectly based on its width
                  maxHeight: 120,
                  overflowY: "auto",
                  zIndex: 1000,
                  width: "70%", // Match the width of the TextField
                }}
              >
                <List>
                  {filteredCourses.map((course) => (
                    <ListItem
                      button
                      key={course.id}
                      onClick={() => handleDropdownItemClick(course)}
                    >
                      <ListItemText
                        primary={course.title}
                        sx={{
                          color:
                            theme.palette.mode === "light" ? "black" : "white",
                        }} // Use sx for custom styling
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
          <Box
            sx={{ position: "relative", display: "flex", alignItems: "center" }}
          >
            {!isMobile && !showSearch && (
              <TextField
                ref={inputRef}
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onKeyDown={handleSearchSubmit}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                sx={{
                  marginLeft: 2,
                  marginRight: 2,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 10,
                  width: "300px", // Fixed width for desktop
                }}
                InputProps={{
                  sx: {
                    borderRadius: 10,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Remove the default border
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Remove the border on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Remove the border when focused
                    },
                  },
                }}
              />
            )}

            {showDropdown && !isMobile && filteredCourses.length > 0 && (
              <Box
                ref={dropdownRef}
                sx={{
                  position: "absolute",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  marginLeft: 2,
                  top: 35,
                  maxHeight: 200,
                  overflowY: "auto",
                  zIndex: 1000,
                  marginTop: 1, // Ensure there's a little space between the TextField and dropdown
                  width: "300px", // Match the width of the TextField
                }}
              >
                <List>
                  {filteredCourses.map((course) => (
                    <ListItem
                      button
                      key={course.id}
                      onClick={() => handleDropdownItemClick(course)}
                    >
                      <ListItemText
                        primary={course.title}
                        sx={{
                          color:
                            theme.palette.mode === "light" ? "black" : "white",
                        }} // Use sx for custom styling
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>

          {!user && !showSearch && (
            <Box
              sx={{
                display: "flex",
                gap: isMobile ? 2 : 2,
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isMobile ? 2 : 2,
                }}
              >
                {!isMobile && (
                  <div
                    onClick={() => navigate("/courses")} // Use navigate to change the route
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "inherit",
                    }}
                  >
                    <SchoolIcon />
                  </div>
                )}
                {isMobile && (
                  <div
                    onClick={toggleTheme}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "inherit",
                    }}
                  >
                    {theme.palette.mode === "light" ? (
                      <NightsStayIcon />
                    ) : (
                      <WbSunnyIcon />
                    )}
                  </div>
                )}
              </Box>
              <Button
                component={Link}
                to="/signin"
                variant="outlined"
                color="inherit"
                sx={{
                  borderRadius: 10,
                  padding: { xs: "4px 8px", sm: "6px 12px" }, // Smaller padding for mobile
                  fontSize: { xs: "0.75rem", sm: "0.8rem" }, // Smaller font size for mobile
                }}
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
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge
                  badgeContent={Total}
                  color="error"
                  invisible={Total === 0}
                  sx={{ "& .MuiBadge-dot": { top: 10, right: 10 } }}
                >
                  <ShoppingCartCheckoutOutlined color="inherit" />
                </Badge>
              </IconButton>
              <IconButton color="inherit" component={Link} to="/profile">
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleDrawerOpen}>
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleDrawerClose}
        sx={{
          width: 250, // Set drawer width
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250, // Width for the paper inside the drawer
            backgroundColor: "background.paper", // Background color of the drawer
            borderRadius: "10px 0 0 10px", // Add border radius for rounded corners on the left
          },
        }}
      >
        <Box
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
          sx={{
            padding: "20px", 
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "10px" : "15px",
          }}
        >
          <img
            src={require("./image.png")}
            alt="logo"
            style={{
              width: "150px",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />

          {user && (
            <MenuItem onClick={() => navigate("/profile")}>
              <AccountCircle sx={{ marginRight: "10px" }} />
              My Profile
            </MenuItem>
          )}
          {user && (
            <MenuItem onClick={() => navigate("/cart")}>
              <ShoppingCart sx={{ marginRight: "10px" }} />
              My cart {Total > 0 ? `(${Total})` : ""}
            </MenuItem>
          )}

          {user && (
            <MenuItem onClick={() => navigate("/WishList")}>
              <Favorite sx={{ marginRight: "10px" }} />
              My Wishlist
            </MenuItem>
          )}

          {user && (
            <MenuItem onClick={() => navigate("/myCourses/incompleted")}>
              <MenuBook sx={{ marginRight: "10px" }} />
              In-Progress Courses
            </MenuItem>
          )}
          {user && (
            <MenuItem onClick={() => navigate("/myCourses/enrolled")}>
              <AssignmentTurnedIn sx={{ marginRight: "10px" }} />
              Enrolled Courses
            </MenuItem>
          )}
          <MenuItem onClick={toggleTheme}>
            <Brightness6 sx={{ marginRight: "10px" }} />
            Change Theme
          </MenuItem>
          {user && (
            <MenuItem onClick={() => navigate("/changePassword")}>
              <Lock sx={{ marginRight: "10px" }} />
              Change Password
            </MenuItem>
          )}

          <Divider sx={{ marginTop: "20px" }} />

          {user && (
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ marginRight: "10px" }} />
              Logout
            </MenuItem>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

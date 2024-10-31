const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign Up
const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    // Email and password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valid email pattern
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 chars, 1 letter, 1 number

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: 'Password must be at least 8 characters long and contain both letters and numbers' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User created', userId: newUser._id });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const message = field === 'username' 
                ? 'Username already taken' 
                : 'Email already signed up';
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};



// Sign In
const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Function to add a completed course to a user
const addCompletedCourse = async (req, res) => {
    const { userId, courseId } = req.body; // Expecting userId and courseId in the request body

    try {
        // Find the user by ID and update their completedCourses array
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { completedCourses: courseId } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the updated user document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Course added to completed courses', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Fetch User Data by ID
const getUserById = async (req, res) => {
    const { id } = req.params; // Extract user ID from request parameters

    try {
        const user = await User.findById(id).select('-password'); // Exclude the password field from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signUp, signIn, addCompletedCourse, getUserById };


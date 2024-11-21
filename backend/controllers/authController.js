const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import crypto
const nodemailer = require('nodemailer'); // Ensure you install Nodemailer if not already installed

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send the reset email
const sendResetEmail = async (email, token) => {
    const resetURL = `http://localhost:3000/reset-password?token=${token}`; // Adjust URL if needed

    const mailOptions = {
        from: process.env.EMAIL_USER, // Your email
        to: email,
        subject: 'Password Reset',
        text: `Please use the following link to reset your password: ${resetURL}`,
    };

    await transporter.sendMail(mailOptions);
};
// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        // Generate a reset token and expiry date
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        await sendResetEmail(user.email, resetToken);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }, // Check if the token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash and save the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Sign Up
const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    // Email and password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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
    const { userId, courseId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { completedCourses: courseId } },
            { new: true }
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
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { 
    signUp, 
    signIn, 
    addCompletedCourse, 
    getUserById, 
    forgotPassword, 
    resetPassword 
};

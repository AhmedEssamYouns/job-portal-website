const User = require('../models/User');
const asyncWrapper = require("../utils/asyncWrapper");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
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

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude password from user data
        const { password: _, ...userData } = user.toObject();

        res.json({
            message: "Login successful",
            token,
            username: userData.username,
            email: userData.email,
            userId: userData._id,
            avatar: userData.avatar

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "202027076@std.sci.cu.edu.eg", 
    pass: "fmkr kvxg sjmt kcdn",  
  },
});

// Send Verification Email
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: "202027076@std.sci.cu.edu.eg", 
    to: email,
    subject: "Your Verification Code",
    text: `Your 6-digit verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

// Forgot Password - Generate and Send Verification Code
const forgotPassword = asyncWrapper(async (req, res, next) => {
  try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user) {
          const error = appError.create("User not found.", 404, httpStatusText.FAIL);
          return next(error);
      }

      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Save the verification code to the user
      user.passwordResetCode = verificationCode; 
      user.passwordResetVerified = false; 
      await user.save();

      // Send verification code to user's email
      await sendVerificationEmail(email, verificationCode);

      res.status(200).json({
          status: "success",
          message: "Verification code sent successfully to your email.",
      });
  } catch (err) {
      console.error("Error in forgotPassword:", err);
      next(
          appError.create(
              "An error occurred while sending the verification email.",
              500,
              httpStatusText.FAIL
          )
      );
  }
});

// Verify Reset Code
const verifyResetCode = asyncWrapper(async (req, res, next) => {
  const { email, resetCode } = req.body;

  // Validate input
  if (!email || !resetCode) {
      const error = appError.create(
          "Email and reset code are required.",
          400,
          httpStatusText.FAIL
      );
      return next(error);
  }

  // Find user
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
      const error = appError.create("User not found.", 404, httpStatusText.FAIL);
      return next(error);
  }

  // Check if the code matches
  if (user.passwordResetCode !== resetCode) {
      const error = appError.create(
          "Invalid reset code.",
          400,
          httpStatusText.FAIL
      );
      return next(error);
  }

  try {
      // Mark the reset code as verified
      user.passwordResetVerified = true;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      await user.save();

      res.status(200).json({
          status: "success",
          message: "Verification code is valid.",
          token: token
      });
  } catch (err) {
      console.error("Error in verifyResetCode:", err);
      next(
          appError.create(
              "An error occurred while verifying the reset code.",
              500,
              httpStatusText.FAIL
          )
      );
  }
});

const resetPassword = asyncWrapper(async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    // Ensure newPassword is provided
    if (!newPassword) {
      const error = appError.create(
        "New password is required.",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      const error = appError.create(
        "Authorization token is required.",
        401,
        httpStatusText.UNAUTHORIZED
      );
      return next(error);
    }

    // Verify the token
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      const error = appError.create(
        "Invalid or expired token.",
        401,
        httpStatusText.UNAUTHORIZED
      );
      return next(error);
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      const error = appError.create("User not found.", 404, httpStatusText.FAIL);
      return next(error);
    }

    // Ensure the reset code was verified
    if (!user.passwordResetVerified) {
      const error = appError.create(
        "Reset code has not been verified.",
        403,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password and clear reset fields
    user.password = hashedPassword;
    user.passwordResetVerified = false; // Reset the verified flag
    user.passwordResetCode = undefined; // Clear reset code
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully.",
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    next(
      appError.create(
        "An error occurred while resetting the password.",
        500,
        httpStatusText.FAIL
      )
    );
  }
});


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


const setAdminStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Uses not found",userId: userId });
    }

    // Update isAdmin status to true
    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: "User has been granted admin privileges.", user });
  } catch (error) {
    console.error("Error setting admin status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signUp, signIn, addCompletedCourse, getUserById , forgotPassword , verifyResetCode , resetPassword ,setAdminStatus};

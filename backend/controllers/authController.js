const User = require('../models/User');
const asyncWrapper = require("../utils/asyncWrapper");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const GridFS = require('../config/gridfsConfig');
const { getGFS } = require('../config/gridfsConfig');  // Adjust the path if needed
const mongoose = require('mongoose');


const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    // Email and password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valid email pattern
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;


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

const changePassword = asyncWrapper(async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Ensure currentPassword and newPassword are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Current password and new password are required."
      });
    }

    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization token is required."
      });
    }

    // Verify the token
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid or expired token."
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found."
      });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: "Current password is incorrect."
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password has been changed successfully."
    });
  } catch (err) {
    console.error("Error in changePassword:", err);
    return res.status(500).json({
      status: "fail",
      message: "An error occurred while changing the password."
    });
  }
});
const { getGridFSBucket } = require('../config/gridfsConfig'); // Adjust the path as needed
const uploadImage = async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const { file } = req; // Multer adds the file to the request
    const { userId } = req.params; // Assuming user ID is passed as a URL parameter

    if (!file) {
      return res.status(400).send({ message: 'No file provided' });
    }

    // Open upload stream
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    // Pipe file buffer to upload stream
    uploadStream.end(file.buffer);

    uploadStream.on('finish', async () => {
      try {
        console.log('File uploaded successfully:', uploadStream.id);

        // Save the file's _id to the user's profile
        const user = await User.findByIdAndUpdate(
          userId,
          { profileImage: uploadStream.id.toString() }, // Save _id as a string
          { new: true }
        );

        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({
          message: 'Profile image uploaded and updated successfully',
          user,
        });
      } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).send({
          message: 'Error updating user profile',
          error: err.message,
        });
      }
    });

    uploadStream.on('error', (err) => {
      console.error('Error saving image to GridFS:', err);
      res.status(500).send({
        message: 'Error saving image',
        error: err.message,
      });
    });
  } catch (err) {
    console.error('Error uploading profile image:', err);
    res.status(500).send({
      message: 'Error uploading profile image',
      error: err.message,
    });
  }
};



const getProfileImage = async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const { filename } = req.params; // Filename from URL parameter

    if (!filename) {
      return res.status(400).send({ message: 'No filename provided' });
    }

    // Open download stream by filename
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on('error', (err) => {
      console.error('Error retrieving image:', err);
      res.status(404).send({ message: 'Image not found', error: err.message });
    });

    // Pipe the stream to the response
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error retrieving profile image:', err);
    res.status(500).send({
      message: 'Error retrieving profile image',
      error: err.message,
    });
  }
};

const getProfileImageById = async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const { id } = req.params; // Get the image ID from the request parameters

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid image ID' });
    }

    // Open download stream by ObjectId
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));

    downloadStream.on('error', (err) => {
      console.error('Error retrieving image:', err);
      res.status(404).send({ message: 'Image not found', error: err.message });
    });

    // Pipe the stream to the response
    res.set('Content-Type', 'image/jpeg'); // Set the correct content type if known
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error retrieving profile image:', err);
    res.status(500).send({
      message: 'Error retrieving profile image',
      error: err.message,
    });
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

module.exports = { signUp, signIn,changePassword,uploadImage, addCompletedCourse, getUserById , forgotPassword ,getProfileImageById, verifyResetCode , resetPassword ,setAdminStatus};

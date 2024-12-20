const express = require('express');
const { signUp, signIn, getUserById, forgotPassword, verifyResetCode, resetPassword, setAdminStatus, changePassword ,uploadImage} = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth'); // Import the adminAuth middleware
const router = express.Router();
const upload = require('../config/multerConfig');  // Import multer configuration
// Existing routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.put('/resetPassword', resetPassword);


// Route for uploading profile image
router.post('/upload', upload.single('profileImage'), uploadImage);
router.get('/:id', getUserById);
router.put('/changePassword', changePassword);

// Route to set user as admin (only accessible by admins)
router.patch('/:userId/setAdmin', adminAuth, setAdminStatus);

module.exports = router;

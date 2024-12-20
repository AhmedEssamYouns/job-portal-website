const express = require('express');
const { signUp, signIn, getUserById, forgotPassword, verifyResetCode, resetPassword, setAdminStatus } = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth'); // Import the adminAuth middleware
const router = express.Router();

// Existing routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.put('/resetPassword', resetPassword);
router.get('/:id', getUserById);

// Route to set user as admin (only accessible by admins)
router.patch('/:userId/setAdmin', adminAuth, setAdminStatus);

module.exports = router;

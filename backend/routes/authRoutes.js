const express = require('express');
const { signUp, signIn, getUserById, forgotPassword, verifyResetCode, resetPassword, setAdminStatus, changePassword ,uploadImage, getProfileImageById} = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth'); 
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// Existing routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.put('/resetPassword', resetPassword);




// POST route to upload image
router.post('/:userId/profile-image', upload.single('profileImage'), uploadImage);
router.get('/:id', getUserById);
router.put('/changePassword', changePassword);
router.get('/profile-image/:id', getProfileImageById);
// Route to set user as admin (only accessible by admins)
router.patch('/:userId/setAdmin', adminAuth, setAdminStatus);

module.exports = router;

const express = require('express');
const { signUp, signIn, getUserById, forgotPassword, verifyResetCode, resetPassword, setAdminStatus, changePassword ,uploadImage, getProfileImageById, editUser, refreshAccessToken} = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth'); 
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.put('/resetPassword', resetPassword);




router.post('/:userId/profile-image', upload.single('profileImage'), uploadImage);
router.get('/:id', getUserById);
router.put('/editUser/:userId', editUser);


router.put('/changePassword', changePassword);
router.get('/profile-image/:id', getProfileImageById);

router.patch('/:userId/setAdmin', adminAuth, setAdminStatus);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;

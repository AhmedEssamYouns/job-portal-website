const express = require('express');
const { signUp, signIn, getUserById,forgotPassword,verifyResetCode,resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.put('/resetPassword', resetPassword);
router.get('/:id', getUserById);
router.post('/forgot-password', forgotPassword);

module.exports = router;

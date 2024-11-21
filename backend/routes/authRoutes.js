const express = require('express');
const { signUp, signIn, getUserById, forgotPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/:id', getUserById);
router.post('/forgot-password', forgotPassword);

module.exports = router;

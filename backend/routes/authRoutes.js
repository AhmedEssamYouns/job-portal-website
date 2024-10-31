const express = require('express');
const { signUp, signIn, getUserById } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/:id', getUserById);

module.exports = router;

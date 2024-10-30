const express = require('express');
const { submitAnswer, completeLevel } = require('../controllers/progressController');

const router = express.Router();

router.post('/answer/:questionId', submitAnswer);
router.post('/complete-level/:levelId', completeLevel);

module.exports = router;

const express = require('express');
const { submitAnswer, completeLevel } = require('../controllers/progressController');
const { addCompletedCourse } = require('../controllers/authController');

const router = express.Router();

router.post('/answer/:questionId', submitAnswer);
router.post('/complete-level/:levelId', completeLevel);
router.post('/completed-course', addCompletedCourse);


module.exports = router;

const express = require('express');
const { addCourse } = require('../controllers/courseController');
const { getCourse } = require('../controllers/courseController');
const { getAllCourses } = require('../controllers/courseController');


const router = express.Router();

// Route to add a new course
router.post('/add', addCourse); // Only authorized users can add courses

// Route to get a course by ID
router.get('/:id', getCourse);
router.get('/', getAllCourses);


module.exports = router;

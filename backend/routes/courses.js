const express = require('express');
const { addCourse, fetchIncompletedCourses, searchCourses, deleteCourse } = require('../controllers/courseController');
const { getCourse } = require('../controllers/courseController');
const { getAllCourses } = require('../controllers/courseController');


const router = express.Router();

// Route to add a new course
router.post('/add', addCourse); // Only authorized users can add courses
router.get('/incompleted-courses/:userId', fetchIncompletedCourses);
router.get('/courses/search', searchCourses);
router.get('/:id', getCourse);
router.get('/', getAllCourses);
router.delete('/course/:id', deleteCourse);

module.exports = router;

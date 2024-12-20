const express = require('express');
const { addCourse, fetchIncompletedCourses, searchCourses, deleteCourse, editCourse } = require('../controllers/courseController');
const { getCourse } = require('../controllers/courseController');
const { getAllCourses } = require('../controllers/courseController');
const { addCommentToCourse, editComment, deleteComment } = require('../controllers/courseController');
const router = express.Router();

// Route to add a new course
router.post('/add', addCourse); // Only authorized users can add courses

// Route to fetch incompleted courses for a user
router.get('/incompleted-courses/:userId', fetchIncompletedCourses);

// Route to search for courses based on title and language
router.get('/courses/search', searchCourses);

// Route to get a specific course by ID
router.get('/:id', getCourse);

// Route to get all courses
router.get('/', getAllCourses);

// Route to delete a course by ID
router.delete('/course/:id', deleteCourse);

// Route to edit a course
router.put('/:courseId/edit', editCourse);  // PUT /courses/:courseId/edit

// Add a comment to a course
router.post('/:courseId/comments', addCommentToCourse);  // POST /courses/:courseId/comments

// Edit a comment on a course
router.put('/:courseId/comments/:commentId', editComment);  // PUT /courses/:courseId/comments/:commentId

// Delete a comment from a course
router.delete('/:courseId/comments/:commentId', deleteComment);  // DELETE /courses/:courseId/comments/:commentId

module.exports = router;

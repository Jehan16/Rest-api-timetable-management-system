const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const courseController = require('../controllers/courses')

// router.use(express.urlencoded({ extended: true }))

// GET all the courses
router.get('/', courseController.courses_get_all)

// GET course by Id
router.get('/:courseId', courseController.courses_get_course)

// POST courses
router.post('/', checkAuth.logged_in_user, courseController.courses_create_course)

// UPDATE course by Id
router.patch('/:courseId', checkAuth.logged_in_user, courseController.courses_update_course)

// DELETE course by Id
router.delete('/:courseId', checkAuth.logged_in_user, courseController.courses_delete_course)

module.exports = router
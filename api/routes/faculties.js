const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const facultyController = require('../controllers/faculties')

// POST faculty
router.post('/', checkAuth.logged_in_user, checkAuth.restrict('admin'), facultyController.create_faculty)

// assign faculty to course
router.post('/assign-faculty-to-course', checkAuth.logged_in_user, checkAuth.restrict('admin'), facultyController.assign_faculty_to_course)

// get all faculties
router.get('/', checkAuth.logged_in_user, facultyController.get_all_faculties)

module.exports = router
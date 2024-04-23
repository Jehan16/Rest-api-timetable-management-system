const express = require('express');
const router = express.Router();
const enrollController = require('../controllers/enroll');
const checkAuth = require('../middleware/check-auth')

// enroll a student in a course
router.post('/', enrollController.enroll);

// get students timetable
router.get('/timetable/:studentId', checkAuth.logged_in_user, checkAuth.restrict('student'), enrollController.get_timetable);

module.exports = router;

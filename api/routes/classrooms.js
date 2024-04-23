const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const classroomController = require('../controllers/classrooms')

// create a new classroom
router.post('/', classroomController.add_classroom)

// get all classrooms
router.get('/', classroomController.get_all_classrooms)

// get classroom by id
router.get('/:classroomId', classroomController.get_classrooms_by_id)

// delete classroom by id
router.delete('/:classroomId', checkAuth.logged_in_user, checkAuth.restrict('admin'), classroomController.delete_classrooms_by_id)

module.exports = router
const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const timetablesController = require('../controllers/timetables')

// GET timetables
router.get('/', checkAuth.logged_in_user, timetablesController.timetables_get_all)

// GET timetable using ID
router.get('/:timetableId', checkAuth.logged_in_user, timetablesController.timetable_get_timetable)

// POST a timetable
router.post('/', checkAuth.logged_in_user, timetablesController.timetables_create_timetable);

router.patch('/:timetableId', checkAuth.logged_in_user, checkAuth.restrict('admin'), timetablesController.timetables_update_timetable)

// DELETE a timetable
router.delete('/:timetableId', checkAuth.logged_in_user, timetablesController.timetables_delete_timetable)

module.exports = router
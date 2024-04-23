const express = require('express')
const router = express.Router()

const userController = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')

// check the available users
router.get('/', checkAuth.logged_in_user, checkAuth.restrict('admin'), userController.users_get_emails)

// user signup
router.post('/signup', userController.users_signup)

//user signIn
router.post('/login', userController.users_login)

// user delete
router.delete('/:userId', checkAuth.logged_in_user, checkAuth.restrict('admin'), userController.users_delete)

router.get('/notifications/:userId', checkAuth.logged_in_user, checkAuth.restrict('student'), userController.student_notification)

module.exports = router 
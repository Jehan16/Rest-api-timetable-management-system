const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const bookingController = require('../controllers/bookings')

// create a new booking
router.post('/', bookingController.create)

// get all bookings
router.get('/', bookingController.getAll)

// get booking by id
router.get('/:bookingId', bookingController.getById)

// delete booking by id
router.delete('/:bookingId', bookingController.deleteById)

module.exports = router
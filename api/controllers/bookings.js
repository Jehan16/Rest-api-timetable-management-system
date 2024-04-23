const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Resource = require('../models/resource')
const Classroom = require('../models/classroom')

exports.create = (req, res, next) => {
    const { classroomId, resourceId, startTime, endTime } = req.body;

    // Check for overlapping bookings
    Booking.findOne({
        $or: [
            {
                $and: [
                    { classroomId: classroomId },
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } }
                ]
            },
            {
                $and: [
                    { resourceId: resourceId },
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } }
                ]
            }
        ]
    })
        .then(existingBooking => {
            if (existingBooking) {
                // There is an overlapping booking
                return res.status(400).json({ error: 'There is an overlapping booking.' });
            }

            // No overlapping booking found, proceed to create new booking
            const booking = new Booking({
                _id: new mongoose.Types.ObjectId(),
                classroomId: classroomId,
                resourceId: resourceId,
                startTime: startTime,
                endTime: endTime
            });

            return booking.save()
                .then(result => {
                    console.log('Booking created successfully');
                    res.status(201).json({
                        message: 'Booking created successfully',
                        booking: result
                    });
                });
        })
        .catch(err => {
            console.error('Error creating Booking:', err);
            res.status(500).json({ error: err });
        });
};



exports.getAll = (req, res, next) => {
    Booking.find()
        .populate('classroomId', 'name') // Populate the classroom name
        .populate('resourceId', 'name') // Populate the resource name
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                bookings: result.map(booking => {
                    return {
                        _id: booking._id,
                        classroomId: booking.classroomId,
                        resourceId: booking.resourceId,
                        startTime: booking.startTime,
                        endTime: booking.endTime
                    };
                })
            });
        })
        .catch(err => {
            console.error('Error fetching bookings:', err);
            res.status(500).json({ error: err });
        });
};

exports.getById = (req, res, next) => {
    Booking.findById(req.params.bookingId)
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Booking not found'
                });
            }
            res.status(200).json(result);
        })
        .catch(err => {
            console.error('Error fetching Booking by ID:', err);
            res.status(500).json({ error: err });
        });
};

exports.deleteById = (req, res, next) => {
    Booking.findByIdAndDelete({ _id: req.params.bookingId })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Booking not found'
                });
            }
            res.status(200).json({
                message: 'Booking deleted successfully',
                deletedClassroom: result
            });
        })
        .catch(err => {
            console.error('Error deleting Booking by ID:', err);
            res.status(500).json({ error: err });
        });
};

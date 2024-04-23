const mongoose = require('mongoose');
const Timetable = require('../models/timetable');
const Course = require('../models/course');
const User = require('../models/user');
const handleTimetableUpdateOrCreation = require('../utils/handleTimetableUpdateOrCreation');

// GET all timetables
exports.timetables_get_all = (req, res, next) => {
    Timetable.find()
        .select('_id course time faculty location')
        .populate('course', 'name code')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                timetables: docs
            });
        })
        .catch(err => {
            console.error("Error fetching all timetables:", err); // Log the error
            res.status(500).json({
                error: err.message // Send error message in response
            });
        });
};

// GET timetable by Id
exports.timetable_get_timetable = (req, res, next) => {
    Timetable.findById(req.params.timetableId)
        .populate('course')
        .exec()
        .then(timetable => {
            if (!timetable) {
                return res.status(404).json({
                    message: 'Timetable not found'
                });
            }
            res.status(200).json({
                timetable: timetable,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/timetables'
                }
            });
        })
        .catch(err => {
            console.error("Error fetching timetable by ID:", err); // Log the error
            res.status(500).json({
                error: err.message // Send error message in response
            });
        });
};

// POST a timetable
exports.timetables_create_timetable = (req, res, next) => {
    const courseId = req.body.course;
    Course.findById(courseId)
        .populate('faculty')
        .then(course => {
            if (!course) {
                return res.status(404).json({
                    message: 'Course not found!'
                });
            }
            const facultyName = course.faculty ? course.faculty.name : 'Unknown';

            const timetable = new Timetable({
                _id: new mongoose.Types.ObjectId(),
                course: courseId,
                time: req.body.time,
                faculty: facultyName,
                location: req.body.location
            });

            return timetable.save()
                .then(async result => {
                    console.log("Timetable created:"); // Debug output

                    // Trigger notification for timetable creation
                    await handleTimetableUpdateOrCreation(result._id, courseId, 'Timetable created');

                    res.status(200).json({
                        message: 'Timetable created successfully',
                        TimetableCreated: {
                            _id: result._id,
                            course: result.course,
                            time: result.time,
                            faculty: result.faculty,
                            location: result.location
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/timetables/' + result._id
                        }
                    });
                });
        })
        .catch(err => {
            console.error("Error creating timetable:", err); // Log the error
            res.status(500).json({
                error: err.message // Send error message in response
            });
        });
};

// Update a timetable
exports.timetables_update_timetable = (req, res, next) => {
    const id = req.params.timetableId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Timetable.findOneAndUpdate({ _id: id }, { $set: updateOps })
        .exec()
        .then(async result => {
            res.status(200).json({
                message: 'Timetable updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/timetables/' + id
                }
            });

            // Trigger notification for timetable update
            await handleTimetableUpdateOrCreation(id, result.course, 'Timetable updated');
        })
        .catch(err => {
            console.error("Error updating timetable:", err); // Log the error
            res.status(500).json({
                error: err.message // Send error message in response
            });
        });
};

// DELETE a timetable
exports.timetables_delete_timetable = (req, res, next) => {
    Timetable.findOneAndDelete({ _id: req.params.timetableId })
        .exec()
        .then(async result => {
            res.status(200).json({
                message: 'Timetable deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/timetables',
                    body: { course: 'courseID', time: 'time', faculty: 'faculty', location: 'location' }
                }
            });

            // Trigger notification for timetable deletion
            await handleTimetableUpdateOrCreation(req.params.timetableId, result.course, 'Timetable deleted');
        })
        .catch(err => {
            console.error("Error deleting timetable:", err); // Log the error
            res.status(500).json({
                error: err.message // Send error message in response
            });
        });
};

const mongoose = require('mongoose')

const Classroom = require('../models/classroom')

// create a classroom
exports.add_classroom = (req, res, next) => {
    const classroom = new Classroom({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        capacity: req.body.capacity
    })
    classroom.save()
        .then(result => {
            console.log('classroom created successfully')
            res.status(200).json({
                message: 'classroom created successfully',
                classroom: {
                    name: result.name,
                    capacity: result.capacity
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// get all classrooms
exports.get_all_classrooms = (req, res, next) => {
    Classroom.find()
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                classrooms: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// get classroom by id
exports.get_classrooms_by_id = (req, res, next) => {
    const classroom = Classroom.findById(req.params.classroomId)
        .exec()
        .then(result => {
            if (!classroom) {
                return res.status(404).json({
                    message: 'Classroom not found'
                })
            }
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// delete a classroom
exports.delete_classrooms_by_id = (req, res, next) => {
    Classroom.findOneAndDelete({ _id: req.params.classroomId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Classroom deleted successfully',
                classroom: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
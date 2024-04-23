const mongoose = require('mongoose')

const Course = require('../models/course')

// GET all the courses
exports.courses_get_all = (req, res, next) => {
    Course.find()
        .select('_id name code description credits faculty')
        .populate('faculty', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                courses: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        code: doc.code,
                        description: doc.description,
                        credits: doc.credits,
                        faculty: doc.faculty,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/Courses/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

// GET course by Id
exports.courses_get_course = (req, res, next) => {
    const id = req.params.courseId

    Course.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({
                    message: 'No valid entry found for the provided Id'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

// POST courses
exports.courses_create_course = (req, res, next) => {
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        credits: req.body.credits
    })
    course.save()
        .then(result => {
            res.status(200).json({
                message: 'Course added successfully',
                CreatedCourse: {
                    name: result.name,
                    code: result.code,
                    description: result.description,
                    credits: result.credits,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/courses/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

// UPDATE course by Id
exports.courses_update_course = (req, res, next) => {
    const id = req.params.courseId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Course.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Course updated Successfully',
                updatedCourse: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

// DELETE course by Id
exports.courses_delete_course = (req, res, next) => {
    const id = req.params.courseId
    Course.findOneAndDelete({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Course deleted',
                course: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}
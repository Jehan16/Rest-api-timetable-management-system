const mongoose = require('mongoose')

const timetableSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    time: { type: String, required: true },
    faculty: { type: String, required: true },
    location: { type: String, required: true }
})

module.exports = mongoose.model('Timetable', timetableSchema)
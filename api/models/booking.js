const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', require: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', require: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
})

module.exports = mongoose.model('Booking', bookingSchema)
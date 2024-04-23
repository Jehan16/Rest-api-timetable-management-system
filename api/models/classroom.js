const mongoose = require('mongoose')

const classroomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    capacity: { type: Number, required: true }
})

module.exports = mongoose.model('Classroom', classroomSchema)
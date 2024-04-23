const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    credits: { type: Number, required: true },
    faculty: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'
    }
})

module.exports = mongoose.model('Course', courseSchema)
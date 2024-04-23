const mongoose = require('mongoose')

const resourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
})

module.exports = mongoose.model('Resource', resourceSchema)
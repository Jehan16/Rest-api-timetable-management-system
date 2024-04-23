const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

courseRoutes = require('./api/routes/courses')
timetableRoutes = require('./api/routes/timetables')
userRoutes = require('./api/routes/users')
facultyRoutes = require('./api/routes/faculties')
classroomRoutes = require('./api/routes/classrooms')
resourceRoutes = require('./api/routes/resources')
bookingRoutes = require('./api/routes/bookings')
enrollRoutes = require('./api/routes/enroll')

// Connect to MongoDB
mongoose.connect('mongodb+srv://it21804342:' + process.env.MONGO_ATLAS_PW + '@cluster0.hr4qoux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    tls: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/courses', courseRoutes)
app.use('/timetables', timetableRoutes)
app.use('/users', userRoutes)
app.use('/faculty', facultyRoutes)
app.use('/classrooms', classroomRoutes)
app.use('/resources', resourceRoutes)
app.use('/bookings', bookingRoutes)
app.use('/enroll', enrollRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
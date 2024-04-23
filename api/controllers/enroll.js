const mongoose = require('mongoose')

const Enrollment = require('../models/enroll')
const Student = require('../models/user')
const Course = require('../models/course')
const Timetable = require('../models/timetable')

exports.enroll = async (req, res) => {
    try {
        const { user, course } = req.body;
        if (!user || !course) {
            return res.status(400).json({ error: "Both studentId and courseId are required in the request body" });
        }

        console.log("Received enrollment request for studentId:", user, "and courseId:", course); // debug

        // Check if the student is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({ user: user, course: course });
        if (existingEnrollment) {
            console.log("Student is already enrolled in the course");
            return res.status(400).json({ error: "Student is already enrolled in the course" });
        }

        // Create a new enrollment
        const enrollment = new Enrollment({
            _id: new mongoose.Types.ObjectId(),
            user: user,
            course: course
        });

        // Save the enrollment to MongoDB
        const savedEnrollment = await enrollment.save();
        console.log("Student enrolled successfully in the course");
        res.status(201).json({
            message: 'Student enrolled in the course successfully',
            enrolment: savedEnrollment
        });
    } catch (error) {
        console.error("Error enrolling student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.get_timetable = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Find all enrollments for the student
        const enrollments = await Enrollment.find({ user: studentId }).populate('course');

        if (enrollments.length === 0) {
            return res.status(404).json({ error: "No enrollments found for the student" });
        }

        // Prepare an array to store timetables
        let timetables = [];

        // Fetch timetables for each enrollment concurrently
        const fetchTimetablesPromises = enrollments.map(async (enrollment) => {
            const courseId = enrollment.course._id; // Get the course ID from the enrollment
            const courseTimetables = await Timetable.find({ course: courseId })
                .populate('course', 'name');
            // console.log("Timetables for Course ID:", courseId, courseTimetables); for debug purposes
            timetables.push(...courseTimetables);
        });

        await Promise.all(fetchTimetablesPromises);

        // console.log("All Timetables:", timetables); for debug purposes

        res.status(200).json({
            sessions: timetables.length,
            timetables: timetables.map(timetable => {
                return {
                    id: timetable._id,
                    course: timetable.course.name,
                    time: timetable.time,
                    faculty: timetable.faculty,
                    location: timetable.location
                }
            })
        });
    } catch (error) {
        console.error("Error retrieving timetables:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

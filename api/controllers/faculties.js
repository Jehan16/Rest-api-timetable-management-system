const mongoose = require('mongoose')

const Faculty = require('../models/faculty')
const Course = require('../models/course')

// create a faculty
exports.create_faculty = (req, res, next) => {
    const faculty = new Faculty({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    faculty.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Faculty created successfully',
                createdFaculty: {
                    _id: result._id,
                    name: result.name,
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

// assign a faculty to the course
exports.assign_faculty_to_course = async (req, res, next) => {
    try {
        const { facultyId, courseId } = req.body;

        // Check if faculty and course exist
        const faculty = await Faculty.findById(facultyId);
        const course = await Course.findById(courseId);

        if (!faculty || !course) {
            return res.status(404).json({
                message: 'Faculty or course not found'
            });
        }

        // Add the course to the faculty's course array
        faculty.courses.push(courseId);
        await faculty.save();

        // Assign the faculty to the course
        course.faculty = facultyId;
        await course.save();

        console.log('Faculty assigned to course successfully')
        res.status(200).json({
            message: 'Faculty assigned to course successfully',
            facultyDetails: faculty,
            courseDetails: course
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error assigning faculty to course',
            error: err
        });
    }
};

// GET all faculties
exports.get_all_faculties = (req, res, next) => {
    Faculty.find()
        .select('_id name courses')
        .populate('courses', 'name') // Populate the courses field with relevant data
        .exec()
        .then(faculties => {
            const response = {
                count: faculties.length,
                faculties: faculties.map(faculty => {
                    return {
                        _id: faculty._id,
                        name: faculty.name,
                        courses: faculty.courses.map(course => {
                            return {
                                _id: course._id,
                                name: course.name,
                            }
                        })
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

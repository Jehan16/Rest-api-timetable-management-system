const Timetable = require('../models/timetable');
const Enrollment = require('../models/enroll');

// Function to handle timetable update or creation
async function handleTimetableUpdateOrCreation(timetableId, courseId, changes) {
    try {
        console.log('handle timetable update or creation function is called')

        // Find users enrolled in the course
        const enrolledUsers = await Enrollment.find({ course: courseId }).populate('user');

        // Construct notification message
        const notificationMessage = `Timetable with ID ${timetableId} has been updated: ${changes}`;

        // Update notification field for each user
        const updatePromises = enrolledUsers.map(async enrollment => {
            const user = enrollment.user;
            if (user) {
                console.log('notification updated') // debug
                user.notification.push(notificationMessage);
                await user.save();
            }
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
    } catch (error) {
        console.error("Error handling timetable update or creation:", error);
    }
}

module.exports = handleTimetableUpdateOrCreation;

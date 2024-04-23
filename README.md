[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)

# API endpoint documentation

## User Authentication and Authorization

### POST /api/users/register

- **Description**: Register a new user.
- **Request Body**:
  - `email` (string, required): Email address of the user.
  - `password` (string, required): Password of the user.
  - `role` (string, optional): Role of the user (admin, faculty, student). Default is student.
- **Response**:
  - `user` (object): Created user details.
- **Authorization**: None

### POST /api/users/login

- **Description**: Authenticate a user and generate JWT token.
- **Request Body**:
  - `email` (string, required): Email address of the user.
  - `password` (string, required): Password of the user.
- **Response**:
  - `token` (string): JWT token for authenticated user.
  - `user` (object): User details.
- **Authorization**: None

### GET /api/users/profile

- **Description**: Fetch user profile.
- **Response**:
  - `user` (object): User details.
- **Authorization**: Required (Bearer token)

### PUT /api/users/profile

- **Description**: Update user profile.
- **Request Body**:
  - `email` (string): New email address of the user.
  - `password` (string): New password of the user.
  - `notification` (array): Array of notification messages for the user.
- **Response**:
  - `user` (object): Updated user details.
- **Authorization**: Required (Bearer token)

### DELETE /api/users/:userId

- **Description**: Delete a user.
- **Request Parameters**:
  - `userId` (string, required): ID of the user to delete.
- **Response**:
  - `message` (string): Confirmation message.
- **Authorization**: Required (Bearer token, Admin only)

## Course Management

### GET /api/courses

- **Description**: Fetch all courses.
- **Response**:
  - `courses` (array): List of courses.
- **Authorization**: Required (Bearer token)

### POST /api/courses

- **Description**: Create a new course.
- **Request Body**:
  - `name` (string, required): Name of the course.
  - `code` (string, required): Course code.
  - `description` (string): Description of the course.
  - `credits` (number, required): Credits associated with the course.
  - `faculty` (string, optional): ID of the faculty teaching the course.
- **Response**:
  - `course` (object): Created course details.
- **Authorization**: Required (Bearer token, Admin only)

### GET /api/courses/:id

- **Description**: Fetch a course by ID.
- **Request Parameters**:
  - `id` (string, required): ID of the course to fetch.
- **Response**:
  - `course` (object): Details of the fetched course.
- **Authorization**: Required (Bearer token)

### PUT /api/courses/:id

- **Description**: Update a course.
- **Request Parameters**:
  - `id` (string, required): ID of the course to update.
- **Request Body**:
  - `name` (string): Updated name of the course.
  - `code` (string): Updated course code.
  - `description` (string): Updated description of the course.
  - `credits` (number): Updated credits associated with the course.
  - `faculty` (string): ID of the faculty teaching the course.
- **Response**:
  - `course` (object): Updated course details.
- **Authorization**: Required (Bearer token, Admin only)

### DELETE /api/courses/:id

- **Description**: Delete a course.
- **Request Parameters**:
  - `id` (string, required): ID of the course to delete.
- **Response**:
  - `message` (string): Confirmation message.
- **Authorization**: Required (Bearer token, Admin only)

## Timetable Management

### GET /api/timetables

- **Description**: Fetch all timetables.
- **Response**:
  - `timetables` (array): List of timetables.
- **Authorization**: Required (Bearer token)

### POST /api/timetables

- **Description**: Create a new timetable.
- **Request Body**:
  - `course` (string, required): ID of the course associated with the timetable.
  - `time` (string, required): Time slot for the timetable.
  - `faculty` (string, required): Name of the faculty assigned to the timetable.
  - `location` (string, required): Location of the timetable.
- **Response**:
  - `timetable` (object): Created timetable details.
- **Authorization**: Required (Bearer token)

### GET /api/timetables/:id

- **Description**: Fetch a timetable by ID.
- **Request Parameters**:
  - `id` (string, required): ID of the timetable to fetch.
- **Response**:
  - `timetable` (object): Details of the fetched timetable.
- **Authorization**: Required (Bearer token)

### PUT /api/timetables/:id

- **Description**: Update a timetable.
- **Request Parameters**:
  - `id` (string, required): ID of the timetable to update.
- **Request Body**:
  - `course` (string): Updated course associated with the timetable.
  - `time` (string): Updated time slot for the timetable.
  - `faculty` (string): Updated faculty assigned to the timetable.
  - `location` (string): Updated location of the timetable.
- **Response**:
  - `timetable` (object): Updated timetable details.
- **Authorization**: Required (Bearer token)

### DELETE /api/timetables/:id

- **Description**: Delete a timetable.
- **Request Parameters**:
  - `id` (string, required): ID of the timetable to delete.
- **Response**:
  - `message` (string): Confirmation message.
- **Authorization**: Required (Bearer token)

## Student Enrollment

### POST /api/enrollments

- **Description**: Enroll a student in a course.
- **Request Body**:
  - `userId` (string, required): ID of the student.
  - `courseId` (string, required): ID of the course.
- **Response**:
  - `enrollment` (object): Created enrollment details.
- **Authorization**: Required (Bearer token, Admin or Faculty)

### GET /api/enrollments/:userId

- **Description**: Fetch all enrollments for a student.
- **Request Parameters**:
  - `userId` (string, required): ID of the student.
- **Response**:
  - `enrollments` (array): List of enrollments for the student.
- **Authorization**: Required (Bearer token, Admin or Faculty)

# Unit testing

run the command `npm test` in the terminal

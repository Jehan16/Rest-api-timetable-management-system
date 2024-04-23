const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

// student notification
exports.student_notification = (req, res, next) => {
    User.findById({ _id: req.params.userId })
        .select('email notification')
        .exec()
        .then(result => {
            res.status(200).json({
                Student: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// check available users
exports.users_get_emails = (req, res, next) => {
    User.find()
        .select('email role')
        .exec()
        .then(result => {
            res.status(200).json({
                userCount: result.length,
                users: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// User signup - updated code for the test cases
exports.users_signup = async (req, res, next) => {
    try {
        const existingUser = await User.find({ email: req.body.email });
        if (existingUser.length >= 1) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            role: req.body.role 
        });
        
        const result = await user.save();
        console.log(result);
        return res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error
        });
    }
};

// user signup
// exports.users_signup = (req, res, next) => {
//     User.find({ email: req.body.email })
//         // .exec()
//         .then(user => {
//             if (user.length >= 1) {
//                 return res.status(409).json({
//                     message: 'Email already exist'
//                 })
//             } else {
//                 bcrypt.hash(req.body.password, 10, (err, hash) => {
//                     if (err) {
//                         return res.status(500).json({
//                             error: err
//                         })
//                     } else {
//                         const user = new User({
//                             _id: new mongoose.Types.ObjectId(),
//                             email: req.body.email,
//                             password: hash,
//                             role: req.body.role 
//                         })
//                         user.save()
//                             .then(result => {
//                                 console.log(result)
//                                 res.status(201).json({
//                                     message: 'User created successfully'
//                                 })
//                             })
//                             .catch(err => {
//                                 console.log(err)
//                                 res.status(500).json({
//                                     error: err
//                                 })
//                             })
//                     }
//                 })
//             }
//         })
// }

// user login
exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
        // .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id,
                        role: user[0].role
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token,
                        userDetails: user.map(doc => {
                            return {
                                id: doc._id,
                                email: doc.email,
                                role: doc.role
                            }
                        })
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(200).json({
                error: err
            })
        })
}

// user delete
exports.users_delete = (req, res, next) => {
    User.findOneAndDelete({ _id: req.params.userId })
        .select('email role')
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted successfully',
                deletedUser: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
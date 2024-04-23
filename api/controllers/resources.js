const mongoose = require('mongoose');
const Resource = require('../models/resource');

exports.create = (req, res, next) => {
    const resource = new Resource({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        quantity: req.body.quantity
    });

    resource.save()
        .then(result => {
            console.log('Resource created successfully');
            res.status(201).json({
                message: 'Resource created successfully',
                Resource: {
                    _id: result._id,
                    name: result.name,
                    quantity: result.quantity
                }
            });
        })
        .catch(err => {
            console.error('Error creating Resource:', err);
            res.status(500).json({ error: err });
        });
};

exports.getAll = (req, res, next) => {
    Resource.find()
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                resources: result
            });
        })
        .catch(err => {
            console.error('Error fetching resources:', err);
            res.status(500).json({ error: err });
        });
};

exports.getById = (req, res, next) => {
    Resource.findById(req.params.resourceId)
        .exec()
        .then(Resource => {
            if (!Resource) {
                return res.status(404).json({
                    message: 'Resource not found'
                });
            }
            res.status(200).json(Resource);
        })
        .catch(err => {
            console.error('Error fetching Resource by ID:', err);
            res.status(500).json({ error: err });
        });
};

exports.deleteById = (req, res, next) => {
    Resource.findByIdAndDelete({ _id: req.params.resourceId })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Resource not found'
                });
            }
            res.status(200).json({
                message: 'Resource deleted successfully',
                deletedClassroom: result
            });
        })
        .catch(err => {
            console.error('Error deleting Resource by ID:', err);
            res.status(500).json({ error: err });
        });
};

const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resources');

// create a resource
router.post('/', resourceController.create);

// get all the resources
router.get('/', resourceController.getAll);

// get resource by id
router.get('/:resourceId', resourceController.getById);

// delete resource by id
router.delete('/:resourceId', resourceController.deleteById);

module.exports = router;

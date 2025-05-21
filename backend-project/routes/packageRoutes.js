const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// GET all packages
router.get('/', packageController.getAllPackages);

// GET a single package by ID
router.get('/:id', packageController.getPackageById);

// POST a new package
router.post('/', packageController.createPackage);

// PUT update a package
router.put('/:id', packageController.updatePackage);

// DELETE a package
router.delete('/:id', packageController.deletePackage);

module.exports = router;
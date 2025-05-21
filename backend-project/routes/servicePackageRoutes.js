const express = require('express');
const router = express.Router();
const servicePackageController = require('../controllers/servicePackageController');

// GET all service packages
router.get('/', servicePackageController.getAllServicePackages);

// GET a single service package by ID
router.get('/:id', servicePackageController.getServicePackageById);

// POST a new service package
router.post('/', servicePackageController.createServicePackage);

// PUT update a service package
router.put('/:id', servicePackageController.updateServicePackage);

// DELETE a service package
router.delete('/:id', servicePackageController.deleteServicePackage);

module.exports = router;
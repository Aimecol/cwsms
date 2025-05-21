const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// GET all cars
router.get('/', carController.getAllCars);

// GET a single car by plate number
router.get('/:plateNumber', carController.getCarByPlateNumber);

// POST a new car
router.post('/', carController.createCar);

// PUT update a car
router.put('/:plateNumber', carController.updateCar);

// DELETE a car
router.delete('/:plateNumber', carController.deleteCar);

module.exports = router;
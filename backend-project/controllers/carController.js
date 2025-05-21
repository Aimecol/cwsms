const Car = require('../models/carModel');

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.getAll();
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get car by plate number
exports.getCarByPlateNumber = async (req, res) => {
  try {
    const car = await Car.getByPlateNumber(req.params.plateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error('Error getting car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new car
exports.createCar = async (req, res) => {
  try {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    
    // Validate required fields
    if (!PlateNumber || !CarType || !CarSize || !DriverName || !PhoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if car already exists
    const existingCar = await Car.getByPlateNumber(PlateNumber);
    if (existingCar) {
      return res.status(400).json({ message: 'Car with this plate number already exists' });
    }
    
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update car
exports.updateCar = async (req, res) => {
  try {
    const { CarType, CarSize, DriverName, PhoneNumber } = req.body;
    
    // Validate required fields
    if (!CarType || !CarSize || !DriverName || !PhoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const updated = await Car.update(req.params.plateNumber, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json({ message: 'Car updated successfully' });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete car
exports.deleteCar = async (req, res) => {
  try {
    const deleted = await Car.delete(req.params.plateNumber);
    if (!deleted) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ message: 'Cannot delete car as it is referenced in service packages' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
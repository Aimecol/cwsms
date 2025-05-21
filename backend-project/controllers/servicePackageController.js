const ServicePackage = require('../models/servicePackageModel');

// Get all service packages
exports.getAllServicePackages = async (req, res) => {
  try {
    const servicePackages = await ServicePackage.getAll();
    res.status(200).json(servicePackages);
  } catch (error) {
    console.error('Error getting service packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get service package by ID
exports.getServicePackageById = async (req, res) => {
  try {
    const servicePackage = await ServicePackage.getById(req.params.recordNumber);
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    res.status(200).json(servicePackage);
  } catch (error) {
    console.error('Error getting service package:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new service package
exports.createServicePackage = async (req, res) => {
  try {
    const { ServiceDate, PlateNumber, PackageNumber } = req.body;
    
    // Validate required fields
    if (!ServiceDate || !PlateNumber || !PackageNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newServicePackage = await ServicePackage.create(req.body);
    res.status(201).json(newServicePackage);
  } catch (error) {
    console.error('Error creating service package:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Car or package does not exist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update service package
exports.updateServicePackage = async (req, res) => {
  try {
    const { ServiceDate, PlateNumber, PackageNumber } = req.body;
    
    // Validate required fields
    if (!ServiceDate || !PlateNumber || !PackageNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const updated = await ServicePackage.update(req.params.recordNumber, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    res.status(200).json({ message: 'Service package updated successfully' });
  } catch (error) {
    console.error('Error updating service package:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Car or package does not exist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete service package
exports.deleteServicePackage = async (req, res) => {
  try {
    const deleted = await ServicePackage.delete(req.params.recordNumber);
    if (!deleted) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    res.status(200).json({ message: 'Service package deleted successfully' });
  } catch (error) {
    console.error('Error deleting service package:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ message: 'Cannot delete service package as it is referenced in payments' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
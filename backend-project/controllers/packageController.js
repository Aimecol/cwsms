const Package = require('../models/packageModel');

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.getAll();
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error getting packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get package by ID
exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.getById(req.params.packageNumber);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(package);
  } catch (error) {
    console.error('Error getting package:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new package
exports.createPackage = async (req, res) => {
  try {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    
    // Validate required fields
    if (!PackageName || !PackagePrice) {
      return res.status(400).json({ message: 'Package name and price are required' });
    }
    
    const newPackage = await Package.create(req.body);
    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update package
exports.updatePackage = async (req, res) => {
  try {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    
    // Validate required fields
    if (!PackageName || !PackagePrice) {
      return res.status(400).json({ message: 'Package name and price are required' });
    }
    
    const updated = await Package.update(req.params.packageNumber, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete package
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.delete(req.params.packageNumber);
    if (!deleted) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ message: 'Cannot delete package as it is referenced in service packages' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
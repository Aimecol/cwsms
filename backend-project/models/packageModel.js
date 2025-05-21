const db = require('../config/db');

class Package {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM Package');
    return rows;
  }

  static async getById(packageNumber) {
    const [rows] = await db.query('SELECT * FROM Package WHERE PackageNumber = ?', [packageNumber]);
    return rows[0];
  }

  // Example of a function where the error might occur
  // Make sure to change the parameter name here as well if it's 'package'
  static async create(packageDetails) { // Changed 'package' to 'packageDetails'
    const { PackageName, PackageDescription, PackagePrice } = packageDetails; // Changed 'package' to 'packageDetails'
    const [result] = await db.query(
      'INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)',
      [PackageName, PackageDescription, PackagePrice]
    );
    return { id: result.insertId, PackageName, PackageDescription, PackagePrice };
  }

  static async update(id, packageDetails) { // Changed 'package' to 'packageDetails'
    const { PackageName, PackageDescription, PackagePrice } = packageDetails; // Changed 'package' to 'packageDetails'
    const [result] = await db.query(
      'UPDATE Package SET PackageName = ?, PackageDescription = ?, PackagePrice = ? WHERE PackageNumber = ?',
      [PackageName, PackageDescription, PackagePrice, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(packageNumber) {
    const [result] = await db.query('DELETE FROM Package WHERE PackageNumber = ?', [packageNumber]);
    return result.affectedRows > 0;
  }
}

module.exports = Package;
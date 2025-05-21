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

  static async create(package) {
    const { PackageName, PackageDescription, PackagePrice } = package;
    const [result] = await db.query(
      'INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)',
      [PackageName, PackageDescription, PackagePrice]
    );
    return { PackageNumber: result.insertId, PackageName, PackageDescription, PackagePrice };
  }

  static async update(packageNumber, package) {
    const { PackageName, PackageDescription, PackagePrice } = package;
    const [result] = await db.query(
      'UPDATE Package SET PackageName = ?, PackageDescription = ?, PackagePrice = ? WHERE PackageNumber = ?',
      [PackageName, PackageDescription, PackagePrice, packageNumber]
    );
    return result.affectedRows > 0;
  }

  static async delete(packageNumber) {
    const [result] = await db.query('DELETE FROM Package WHERE PackageNumber = ?', [packageNumber]);
    return result.affectedRows > 0;
  }
}

module.exports = Package;
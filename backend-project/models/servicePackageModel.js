const db = require('../config/db');

class ServicePackage {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT sp.*, c.DriverName, c.CarType, c.CarSize, p.PackageName, p.PackagePrice 
      FROM ServicePackage sp
      JOIN Car c ON sp.PlateNumber = c.PlateNumber
      JOIN Package p ON sp.PackageNumber = p.PackageNumber
    `);
    return rows;
  }

  static async getById(recordNumber) {
    const [rows] = await db.query(`
      SELECT sp.*, c.DriverName, c.CarType, c.CarSize, p.PackageName, p.PackagePrice 
      FROM ServicePackage sp
      JOIN Car c ON sp.PlateNumber = c.PlateNumber
      JOIN Package p ON sp.PackageNumber = p.PackageNumber
      WHERE sp.RecordNumber = ?
    `, [recordNumber]);
    return rows[0];
  }

  static async create(servicePackage) {
    const { ServiceDate, PlateNumber, PackageNumber } = servicePackage;
    const [result] = await db.query(
      'INSERT INTO ServicePackage (ServiceDate, PlateNumber, PackageNumber) VALUES (?, ?, ?)',
      [ServiceDate, PlateNumber, PackageNumber]
    );
    return { RecordNumber: result.insertId, ServiceDate, PlateNumber, PackageNumber };
  }

  static async update(recordNumber, servicePackage) {
    const { ServiceDate, PlateNumber, PackageNumber } = servicePackage;
    const [result] = await db.query(
      'UPDATE ServicePackage SET ServiceDate = ?, PlateNumber = ?, PackageNumber = ? WHERE RecordNumber = ?',
      [ServiceDate, PlateNumber, PackageNumber, recordNumber]
    );
    return result.affectedRows > 0;
  }

  static async delete(recordNumber) {
    const [result] = await db.query('DELETE FROM ServicePackage WHERE RecordNumber = ?', [recordNumber]);
    return result.affectedRows > 0;
  }
}

module.exports = ServicePackage;
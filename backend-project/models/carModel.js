const db = require('../config/db');

class Car {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM Car');
    return rows;
  }

  static async getByPlateNumber(plateNumber) {
    const [rows] = await db.query('SELECT * FROM Car WHERE PlateNumber = ?', [plateNumber]);
    return rows[0];
  }

  static async create(car) {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = car;
    const [result] = await db.query(
      'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
      [PlateNumber, CarType, CarSize, DriverName, PhoneNumber]
    );
    return { PlateNumber, CarType, CarSize, DriverName, PhoneNumber };
  }

  static async update(plateNumber, car) {
    const { CarType, CarSize, DriverName, PhoneNumber } = car;
    const [result] = await db.query(
      'UPDATE Car SET CarType = ?, CarSize = ?, DriverName = ?, PhoneNumber = ? WHERE PlateNumber = ?',
      [CarType, CarSize, DriverName, PhoneNumber, plateNumber]
    );
    return result.affectedRows > 0;
  }

  static async delete(plateNumber) {
    const [result] = await db.query('DELETE FROM Car WHERE PlateNumber = ?', [plateNumber]);
    return result.affectedRows > 0;
  }
}

module.exports = Car;
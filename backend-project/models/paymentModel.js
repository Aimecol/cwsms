const db = require('../config/db');

class Payment {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT p.*, sp.ServiceDate, sp.PlateNumber, c.DriverName, pkg.PackageName, pkg.PackagePrice
      FROM Payment p
      JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
      JOIN Car c ON sp.PlateNumber = c.PlateNumber
      JOIN Package pkg ON sp.PackageNumber = pkg.PackageNumber
    `);
    return rows;
  }

  static async getById(paymentNumber) {
    const [rows] = await db.query(`
      SELECT p.*, sp.ServiceDate, sp.PlateNumber, c.DriverName, pkg.PackageName, pkg.PackagePrice
      FROM Payment p
      JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
      JOIN Car c ON sp.PlateNumber = c.PlateNumber
      JOIN Package pkg ON sp.PackageNumber = pkg.PackageNumber
      WHERE p.PaymentNumber = ?
    `, [paymentNumber]);
    return rows[0];
  }

  static async create(payment) {
    const { AmountPaid, PaymentDate, RecordNumber } = payment;
    const [result] = await db.query(
      'INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?)',
      [AmountPaid, PaymentDate, RecordNumber]
    );
    return { PaymentNumber: result.insertId, AmountPaid, PaymentDate, RecordNumber };
  }

  static async update(paymentNumber, payment) {
    const { AmountPaid, PaymentDate, RecordNumber } = payment;
    const [result] = await db.query(
      'UPDATE Payment SET AmountPaid = ?, PaymentDate = ?, RecordNumber = ? WHERE PaymentNumber = ?',
      [AmountPaid, PaymentDate, RecordNumber, paymentNumber]
    );
    return result.affectedRows > 0;
  }

  static async delete(paymentNumber) {
    const [result] = await db.query('DELETE FROM Payment WHERE PaymentNumber = ?', [paymentNumber]);
    return result.affectedRows > 0;
  }
}

module.exports = Payment;
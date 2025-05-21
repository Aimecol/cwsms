const db = require('../config/db');

// Get daily sales report
exports.getDailySalesReport = async (req, res) => {
  try {
    const { date } = req.query;
    let query = `
      SELECT 
        DATE_FORMAT(p.PaymentDate, '%Y-%m-%d') as Date,
        COUNT(p.PaymentNumber) as TotalServices,
        COALESCE(SUM(p.AmountPaid), 0) as TotalRevenue
      FROM Payment p
    `;
    
    const params = [];
    if (date) {
      query += ` WHERE DATE(p.PaymentDate) = ?`;
      params.push(date);
    }
    
    query += ` GROUP BY DATE_FORMAT(p.PaymentDate, '%Y-%m-%d')
               ORDER BY Date DESC`;
    
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting daily sales report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get package popularity report
exports.getPackagePopularityReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.PackageNumber,
        p.PackageName,
        COUNT(sp.RecordNumber) as TimesUsed,
        COALESCE(SUM(pay.AmountPaid), 0) as TotalRevenue
      FROM Package p
      LEFT JOIN ServicePackage sp ON p.PackageNumber = sp.PackageNumber
      LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
      GROUP BY p.PackageNumber, p.PackageName
      ORDER BY TimesUsed DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting package popularity report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get customer frequency report
exports.getCustomerFrequencyReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.PlateNumber,
        c.DriverName,
        c.PhoneNumber,
        COUNT(sp.RecordNumber) as VisitCount,
        COALESCE(SUM(pay.AmountPaid), 0) as TotalSpent,
        MAX(pay.PaymentDate) as LastVisit
      FROM Car c
      LEFT JOIN ServicePackage sp ON c.PlateNumber = sp.PlateNumber
      LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
      GROUP BY c.PlateNumber, c.DriverName, c.PhoneNumber
      ORDER BY VisitCount DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting customer frequency report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get revenue by car type report
exports.getRevenueByCarTypeReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.CarType,
        COUNT(sp.RecordNumber) as ServiceCount,
        COALESCE(SUM(pay.AmountPaid), 0) as TotalRevenue,
        COALESCE(AVG(pay.AmountPaid), 0) as AverageRevenue
      FROM Car c
      LEFT JOIN ServicePackage sp ON c.PlateNumber = sp.PlateNumber
      LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
      GROUP BY c.CarType
      ORDER BY TotalRevenue DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting revenue by car type report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get monthly revenue report
exports.getMonthlyRevenueReport = async (req, res) => {
  try {
    const { year } = req.query;
    let query = `
      SELECT 
        DATE_FORMAT(p.PaymentDate, '%Y-%m') as Month,
        COUNT(p.PaymentNumber) as TotalServices,
        COALESCE(SUM(p.AmountPaid), 0) as TotalRevenue
      FROM Payment p
    `;
    
    const params = [];
    if (year) {
      query += ` WHERE YEAR(p.PaymentDate) = ?`;
      params.push(year);
    }
    
    query += ` GROUP BY DATE_FORMAT(p.PaymentDate, '%Y-%m')
               ORDER BY Month DESC`;
    
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting monthly revenue report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unpaid services report
exports.getUnpaidServicesReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        sp.RecordNumber,
        sp.ServiceDate,
        c.PlateNumber,
        c.DriverName,
        c.PhoneNumber,
        p.PackageName,
        p.PackagePrice
      FROM ServicePackage sp
      JOIN Car c ON sp.PlateNumber = c.PlateNumber
      JOIN Package p ON sp.PackageNumber = p.PackageNumber
      LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
      WHERE pay.PaymentNumber IS NULL
      ORDER BY sp.ServiceDate DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting unpaid services report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
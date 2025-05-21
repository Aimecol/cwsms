const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const initDatabase = async () => {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'CWSMS'}`);
    console.log('Database created or already exists');

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'CWSMS'}`);

    // Create Package table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Package (
        PackageNumber INT AUTO_INCREMENT PRIMARY KEY,
        PackageName VARCHAR(100) NOT NULL,
        PackageDescription TEXT,
        PackagePrice DECIMAL(10, 2) NOT NULL
      )
    `);
    console.log('Package table created or already exists');

    // Create Car table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Car (
        PlateNumber VARCHAR(20) PRIMARY KEY,
        CarType VARCHAR(50) NOT NULL,
        CarSize VARCHAR(50) NOT NULL,
        DriverName VARCHAR(100) NOT NULL,
        PhoneNumber VARCHAR(20) NOT NULL
      )
    `);
    console.log('Car table created or already exists');

    // Create ServicePackage table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ServicePackage (
        RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
        ServiceDate DATE NOT NULL,
        PlateNumber VARCHAR(20) NOT NULL,
        PackageNumber INT NOT NULL,
        FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber),
        FOREIGN KEY (PackageNumber) REFERENCES Package(PackageNumber)
      )
    `);
    console.log('ServicePackage table created or already exists');

    // Create Payment table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Payment (
        PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
        AmountPaid DECIMAL(10, 2) NOT NULL,
        PaymentDate DATE NOT NULL,
        RecordNumber INT NOT NULL,
        FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber)
      )
    `);
    console.log('Payment table created or already exists');

    await connection.end();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

initDatabase();
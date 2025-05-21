CREATE DATABASE CWSMS;

USE CWSMS;

CREATE TABLE Package (
    PackageNumber INT PRIMARY KEY AUTO_INCREMENT,
    PackageName VARCHAR(100),
    PackageDescription TEXT,
    PackagePrice DECIMAL(10,2)
);

CREATE TABLE Car (
    PlateNumber VARCHAR(20) PRIMARY KEY,
    CarType VARCHAR(50),
    CarSize VARCHAR(50),
    DriverName VARCHAR(100),
    PhoneNumber VARCHAR(15)
);

CREATE TABLE ServicePackage (
    RecordNumber INT PRIMARY KEY AUTO_INCREMENT,
    ServiceDate DATE,
    PlateNumber VARCHAR(20),
    PackageNumber INT,
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber),
    FOREIGN KEY (PackageNumber) REFERENCES Package(PackageNumber)
);

CREATE TABLE Payment (
    PaymentNumber INT PRIMARY KEY AUTO_INCREMENT,
    RecordNumber INT,
    AmountPaid DECIMAL(10,2),
    PaymentDate DATE,
    FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber)
);

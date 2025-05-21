const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET daily sales report
router.get('/daily', reportController.getDailySalesReport);

// GET monthly revenue report
router.get('/monthly', reportController.getMonthlyRevenueReport);

// GET package popularity report
router.get('/package-popularity', reportController.getPackagePopularityReport);

// GET customer frequency report
router.get('/customer-frequency', reportController.getCustomerFrequencyReport);

// GET revenue by car type report
router.get('/revenue-by-car-type', reportController.getRevenueByCarTypeReport);

// GET unpaid services report
router.get('/unpaid-services', reportController.getUnpaidServicesReport);

module.exports = router;
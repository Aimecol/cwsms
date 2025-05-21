const Payment = require('../models/paymentModel');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.getAll();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.getById(req.params.paymentNumber);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const { AmountPaid, PaymentDate, RecordNumber } = req.body;
    
    // Validate required fields
    if (!AmountPaid || !PaymentDate || !RecordNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newPayment = await Payment.create(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Service package does not exist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const { AmountPaid, PaymentDate, RecordNumber } = req.body;
    
    // Validate required fields
    if (!AmountPaid || !PaymentDate || !RecordNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const updated = await Payment.update(req.params.paymentNumber, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json({ message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Error updating payment:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Service package does not exist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.delete(req.params.paymentNumber);
    if (!deleted) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
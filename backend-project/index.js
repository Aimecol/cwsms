const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const carRoutes = require('./routes/carRoutes');
const packageRoutes = require('./routes/packageRoutes');
const servicePackageRoutes = require('./routes/servicePackageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/service-packages', servicePackageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Car Washing Sales Management System API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const bookingRoutes = require('./bookingRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const phoneRoutes = require('./phoneRoutes');
const fileRoutes = require('./fileRoutes');
const tourismRoutes = require('./tourismRoutes');

const router = express.Router();

// Подключение маршрутов
router.use('/booking', bookingRoutes);
router.use('/sub', subscriptionRoutes);
router.use('/phone', phoneRoutes);
router.use('/sendFile', fileRoutes);
router.use('/tourism', tourismRoutes);

module.exports = router;
const express = require('express');
const bookingRoutes = require('./bookingRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const phoneRoutes = require('./phoneRoutes');
const fileRoutes = require('./fileRoutes');
const tourismRoutes = require('./tourismRoutes');
const quizRoutes = require('./quizRoutes');
const mapRoutes = require('./mapRoutes');

const router = express.Router();

// Подключение маршрутов
router.use('/booking', bookingRoutes);
router.use('/sub', subscriptionRoutes);
router.use('/phone', phoneRoutes);
router.use('/sendFile', fileRoutes);
router.use('/tourism', tourismRoutes);
router.use('/quizzes', quizRoutes);
router.use('/maps', mapRoutes);

module.exports = router;
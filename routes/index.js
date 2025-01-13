const express = require('express');

const authRoutes = require('./authRoutes');
const accountRoutes = require('./accountRoutes');
const categoryRoutes = require('./categoryRoutes');
const transactionRoutes = require('./transactionRoutes');
const summaryRoutes = require('./summaryRoutes');


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/summary', summaryRoutes);

module.exports = router;

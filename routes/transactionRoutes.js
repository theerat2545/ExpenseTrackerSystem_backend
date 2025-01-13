const express = require('express');
const {
    getTransactions,
    createTransaction,
    deleteTransaction,
    uploadSlip,
} = require('../controllers/transactionController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { transactionValidator, uploadSlipValidator } = require('../validators/transactionValidator');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, validate(transactionValidator), createTransaction);
router.delete('/:id', authenticate, deleteTransaction);
router.post('/upload-slip', uploadMiddleware, validate(uploadSlipValidator), uploadSlip);

module.exports = router;

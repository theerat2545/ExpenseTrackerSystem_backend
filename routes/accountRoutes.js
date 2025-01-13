const express = require('express');

const {
    getAccounts,
    createAccount,
    deleteAccount,
} = require('../controllers/accountController');

const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const accountValidator = require('../validators/accountValidator');

const router = express.Router();

router.get('/', authenticate, getAccounts);
router.post('/', authenticate, validate(accountValidator), createAccount);
router.delete('/:id', authenticate, deleteAccount);

module.exports = router;

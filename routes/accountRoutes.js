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

router.use(authenticate);

router.get('/', getAccounts);
router.post('/', validate(accountValidator), createAccount);
router.delete('/:id', deleteAccount);

module.exports = router;

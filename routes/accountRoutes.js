const express = require('express');
const { getAccounts, createAccount, deleteAccount } = require('../controllers/accountController');

const router = express.Router();

router.get('/', getAccounts);
router.post('/', createAccount);
router.delete('/:id', deleteAccount);

module.exports = router;
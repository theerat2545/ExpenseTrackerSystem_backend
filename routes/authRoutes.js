const express = require('express');
const { login, register, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authenticate, logout);

module.exports = router;

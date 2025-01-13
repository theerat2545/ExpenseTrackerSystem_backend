const express = require('express');
const { login, register, logout, logoutAllDevices } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAllDevices);

module.exports = router;

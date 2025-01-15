const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/data-source');
const User = require('../entities/user');

const userRepository = AppDataSource.getRepository(User);

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate email and password
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Check if email already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({ name, email, password: hashedPassword });
        await userRepository.save(user);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to register user', details: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT 
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to login', details: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout', details: err.message });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  };
  
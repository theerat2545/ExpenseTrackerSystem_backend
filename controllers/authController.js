const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/data-source');
const User = require('../entities/user').default || require('../entities/user');
const authSchema = require('../validators/authValidator');

// ลงทะเบียนผู้ใช้
exports.register = async (req, res) => {
    try {
        // validate
        const { error } = authSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { name, email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { email }});
        if (existingUser) return res.status(400).json({ error: `Email already in use` });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({ name, email, password: hashedPassword });
        await userRepository.save(newUser);

        res.status(201).json({ message: 'User registered successfully'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ล็อกอินผู้ใช้
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { email }});
        if (!user) return res.status(400).json({ error: 'Invalid email or password!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password!' });

        const token = jwt.sign({ id: user.id, email: user.email, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
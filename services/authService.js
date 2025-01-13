const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/data-source');
const User = require('../entities/user');

exports.register = async (userData) => {
    const userRepository = AppDataSource.getRepository(User);
    
    const existingUser = await userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = userRepository.create({ ...userData, password: hashedPassword });
    await userRepository.save(newUser);

    return newUser;
};

exports.login = async (email, password) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { user, token };
};

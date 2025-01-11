const AppDataSource = require('../config/data-source');
const User = require('../entities/user');

exports.getUsers = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

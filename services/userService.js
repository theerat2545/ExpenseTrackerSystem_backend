const AppDataSource = require('../config/data-source');
const User = require('../entities/user');

exports.updateProfile = async (userId, updateData) => {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update(userId, updateData);
    const updatedUser = await userRepository.findOne({ where: { id: userId } });
    return updatedUser;
};

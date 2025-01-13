const AppDataSource = require('../config/data-source');
const accountSchema = require('../validators/accountValidator');
const Account = require('../entities/account');
const User = require('../entities/user');

const accountRepository = AppDataSource.getRepository(Account);
const userRepository = AppDataSource.getRepository(User);

exports.getAccounts = async (req, res) => {
    try {
        const accounts = await accountRepository.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch accounts', details: err.message });
    }
};

exports.createAccount = async (req, res) => {
    try {

        const { error, value } = accountSchema.validate(req.body);
        if (error) {
            console.error('Validation error:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const { user_id, name, balance } = value;

        const user = await userRepository.findOne({ where: { id: user_id } });
        if (!user) {
            console.error('User not found for user_id:', user_id);
            return res.status(400).json({ error: 'Invalid user_id. User does not exist.' });
        }

        const newAccount = accountRepository.create({ name, balance, user });
        await accountRepository.save(newAccount);

        res.status(201).json({ message: 'Account created successfully', data: newAccount, });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create account', details: err.message, });
    }
};



exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await accountRepository.delete(id);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account', details: err.message });
    }
};

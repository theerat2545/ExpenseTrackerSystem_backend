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
        // Validate ข้อมูลที่รับเข้ามาก่อน
        const { error, value } = accountSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { user_id, name, balance } = value;

        // ตรวจสอบว่าผู้ใช้มีอยู่จริง
        const user = await userRepository.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // สร้างบัญชีใหม่
        const newAccount = accountRepository.create({ name, balance, user });
        await accountRepository.save(newAccount);

        res.status(201).json({
            message: 'Account created successfully',
            data: newAccount,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create account', details: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;

        // ตรวจสอบว่าบัญชีมีอยู่หรือไม่
        const account = await accountRepository.findOne({ where: { id } });
        if (!account) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        await accountRepository.delete(id);
        res.status(204).send(); // เปลี่ยนเป็น 204 No Content
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account', details: err.message });
    }
};

const AppDataSource = require('../config/data-source');
const Account = require('../entities/account');
const accountSchema = require('../validators/accountValidator');

const accountRepository = AppDataSource.getRepository(Account);

// ดึงข้อมูลบัญชีทั้งหมด
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await accountRepository.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// เพิ่มบัญชี
exports.createAccount = async (req, res) => {
    try {
        const { error, value } = accountSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const newAccount =  accountRepository.create(value);
        await accountRepository.save(newAccount);
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ลบบัญชี
exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await accountRepository.delete(id);
        res.json({ message: 'Account delete successfully'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



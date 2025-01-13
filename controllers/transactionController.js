const AppDataSource = require('../config/data-source');
const Transaction = require('../entities/transaction');
const User = require('../entities/user');
const Account = require('../entities/account');
const Category = require('../entities/categorie');

const { filterProfanity } = require('../utils/profanityFilter');
const { paginate } = require('../utils/paginationHelper');


const transactionRepository = AppDataSource.getRepository(Transaction);
const userRepository = AppDataSource.getRepository(User);
const accountRepository = AppDataSource.getRepository(Account);
const categoryRepository = AppDataSource.getRepository(Category);

exports.getTransactions = async (req, res) => {
    try {
        // รับค่าหน้า (page) และจำนวนข้อมูลต่อหน้า (limit) จาก query parameters
        const { page = 1, limit = 10 } = req.query;

        // ตรวจสอบ limit ว่าอยู่ในตัวเลือกที่อนุญาต
        const allowedLimits = [10, 20, 50, 100];
        const parsedLimit = allowedLimits.includes(parseInt(limit)) ? parseInt(limit) : 10;

        // ดึงข้อมูลทั้งหมดจากฐานข้อมูล
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const transactions = await transactionRepository.find();

        // ใช้ฟังก์ชัน paginate แบ่งข้อมูล
        const paginatedResult = paginate(transactions, parseInt(page), parsedLimit);

        // ส่งข้อมูลกลับไปยัง client
        res.status(200).json({
            message: 'Transactions retrieved successfully',
            ...paginatedResult,
        });
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ error: 'Failed to retrieve transactions', details: error.message });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { amount, note, slipOriginalName, slipFileName, slipFilePath, user_id, account_id, category_id } = req.body;

        if (!amount || !user_id || !account_id || !category_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await userRepository.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid user_id. User does not exist.' });
        }

        const account = await accountRepository.findOne({ where: { id: account_id } });
        if (!account) {
            return res.status(400).json({ error: 'Invalid account_id. Account does not exist.' });
        }

        const category = await categoryRepository.findOne({ where: { id: category_id } });
        if (!category) {
            return res.status(400).json({ error: 'Invalid category_id. Category does not exist.' });
        }

        // กรองคำหยาบใน note
        const sanitizedNote = filterProfanity(note || '');

        const transaction = transactionRepository.create({
            amount,
            note: sanitizedNote, 
            slipOriginalName,
            slipFileName,
            slipFilePath,
            user,
            account,
            category,
        });

        await transactionRepository.save(transaction);

        res.status(201).json({ message: 'Transaction created successfully', data: transaction });
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ error: 'Failed to create transaction', details: err.message });
    }
};


exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await transactionRepository.findOne({ where: { id } });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await transactionRepository.delete(id);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete transaction', details: err.message });
    }
};

exports.uploadSlip = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Slip file is required.' });
        }

        const { originalname, filename, path: filePath } = req.file;
        const { transactionId } = req.body;

        // ตรวจสอบว่า Transaction มีอยู่หรือไม่
        const transaction = await transactionRepository.findOne({ where: { id: transactionId } });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }

        // อัปเดตข้อมูลของ Transaction
        transaction.slipOriginalName = originalname;
        transaction.slipFileName = filename;
        transaction.slipFilePath = filePath;

        await transactionRepository.save(transaction);

        res.status(201).json({
            message: 'Slip uploaded successfully.',
            transaction,
        });
    } catch (error) {
        console.error('Error uploading slip:', error);
        res.status(500).json({ error: error.message });
    }
};


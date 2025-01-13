const AppDataSource = require('../config/data-source');
const Transaction = require('../entities/transaction');
const Account = require('../entities/account');

exports.createTransaction = async (transactionData) => {
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const accountRepository = AppDataSource.getRepository(Account);

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!transactionData.accountId || !transactionData.amount || !transactionData.type) {
        throw new Error('Missing required transaction data');
    }
    if (!['income', 'expense'].includes(transactionData.type)) {
        throw new Error('Invalid transaction type');
    }

    // ใช้ transactionManager สำหรับ Concurrent Update
    let newTransaction;
    await AppDataSource.transaction(async (manager) => {
        const account = await manager.findOne(Account, { where: { id: transactionData.accountId } });
        if (!account) {
            throw new Error('Account not found');
        }

        account.balance += transactionData.type === 'income' ? transactionData.amount : -transactionData.amount;
        await manager.save(account);

        newTransaction = manager.create(Transaction, transactionData);
        await manager.save(newTransaction);
    });

    return newTransaction;
};

exports.saveSlipData = async (slipInfo) => {
    const transactionRepository = AppDataSource.getRepository(Transaction);

    // ตรวจสอบข้อมูลไฟล์ Slip
    if (!slipInfo.originalName || !slipInfo.fileName || !slipInfo.filePath) {
        throw new Error('Missing required slip information');
    }

    const newSlip = transactionRepository.create({
        slipOriginalName: slipInfo.originalName,
        slipFileName: slipInfo.fileName,
        slipFilePath: slipInfo.filePath,
    });

    await transactionRepository.save(newSlip);

    return newSlip;
};

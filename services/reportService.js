const { Between } = require('typeorm');
const AppDataSource = require('../config/data-source');
const Transaction = require('../entities/transaction');

exports.getReport = async (filters) => {
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const where = {};
    if (filters.dateRange) {
        where.date = Between(filters.dateRange.startDate, filters.dateRange.endDate);
    }
    if (filters.type) {
        where.type = filters.type;
    }
    const transactions = await transactionRepository.find({ where });
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return { transactions, total };
};

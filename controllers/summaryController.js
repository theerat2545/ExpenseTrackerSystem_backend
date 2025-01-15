const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const csv = require('csv-parser');

const AppDataSource = require('../config/data-source');
const Transaction = require('../entities/transaction');
const { getReport } = require('../services/reportService');

exports.getFilter = async (req, res) => {
    try {
        // รับพารามิเตอร์สำหรับการกรอง
        const { month, year, type, accountId, categoryId } = req.query;

        // สร้าง QueryBuilder
        const query = AppDataSource.getRepository(Transaction).createQueryBuilder('transaction');

        // กรองตามเดือนและปี
        if (month && year) {
            query.andWhere('MONTH(transaction.created_at) = :month AND YEAR(transaction.created_at) = :year', { month, year });
        } else if (year) {
            query.andWhere('YEAR(transaction.created_at) = :year', { year });
        }

        // กรองตามบัญชี
        if (accountId) {
            query.andWhere('transaction.account_id = :accountId', { accountId });
        }

        // กรองตามหมวดหมู่
        if (categoryId) {
            query
                .innerJoin('transaction.category', 'category') // ทำการ join ตาราง categories
                .andWhere('category.id = :categoryId', { categoryId }); // กรองตาม category_id
        }

        // กรองตามประเภท (ประเภทของ category)
        if (type) {
            query
                .innerJoin('transaction.category', 'categoryType') // ใช้ alias ใหม่เพื่อหลีกเลี่ยงการซ้ำ
                .andWhere('categoryType.type = :type', { type }); // กรองตาม type ของ category
        }

        // ดึงข้อมูลทั้งหมด
        const transactions = await query.getMany();

        // สรุปข้อมูลรายรับ-รายจ่าย
        const summary = transactions.reduce(
            (acc, transaction) => {
                if (transaction.category.type === 'income') {
                    acc.totalIncome += transaction.amount;
                } else if (transaction.category.type === 'expense') {
                    acc.totalExpense += transaction.amount;
                }
                return acc;
            },
            { totalIncome: 0, totalExpense: 0 }
        );

        // ส่งข้อมูลกลับไปยัง client
        res.json({
            message: 'Filter applied successfully',
            transactions,
            summary,
        });
    } catch (error) {
        console.error('Error filtering transactions:', error);
        res.status(500).json({ error: 'Failed to filter transactions', details: error.message });
    }
};

exports.reportSummary = async (req, res) => {
    try {
        const filters = req.body; // รับ filters จาก client
        const report = await getReport(filters); // เรียกใช้ service

        const { transactions, total } = report;

        // คำนวณเพิ่มเติม
        const totalIncome = transactions
            .filter((transaction) => transaction.type === 'income')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const totalExpense = transactions
            .filter((transaction) => transaction.type === 'expense')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const remainingBalance = totalIncome - totalExpense;

        res.status(200).json({
            message: 'Report summary generated successfully',
            data: {
                totalIncome,
                totalExpense,
                remainingBalance,
                transactions,
                total,
            },
        });
    } catch (error) {
        console.error('Error generating report summary:', error);
        res.status(500).json({ error: 'Failed to generate report summary', details: error.message });
    }
};

exports.exportSummary = async (req, res) => {
    try {
        // ดึงข้อมูลที่ต้องการ (สมมติข้อมูล summary ที่จะส่งออก)
        const summaryData = [
            { account: 'Savings', income: 5000, expense: 2000, balance: 3000 },
            { account: 'Business', income: 12000, expense: 8000, balance: 4000 },
        ];

        // รับ `format` จาก query parameter (เช่น ?format=csv หรือ ?format=excel)
        const { format = 'json' } = req.query;

        if (format === 'json') {
            // ส่งออกเป็น JSON
            return res.json(summaryData);
        } else if (format === 'csv') {
            // ส่งออกเป็น CSV
            const parser = new Parser();
            const csv = parser.parse(summaryData);
            const filePath = path.join(__dirname, '../exports/summary.csv');
            fs.writeFileSync(filePath, csv);

            res.download(filePath, 'summary.csv', (err) => {
                if (err) throw err;
                fs.unlinkSync(filePath); // ลบไฟล์เมื่อดาวน์โหลดเสร็จ
            });
        } else if (format === 'excel') {
            // ส่งออกเป็น Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Summary');
            worksheet.columns = [
                { header: 'Account', key: 'account', width: 20 },
                { header: 'Income', key: 'income', width: 15 },
                { header: 'Expense', key: 'expense', width: 15 },
                { header: 'Balance', key: 'balance', width: 15 },
            ];
            worksheet.addRows(summaryData);

            const filePath = path.join(__dirname, '../exports/summary.xlsx');
            await workbook.xlsx.writeFile(filePath);

            res.download(filePath, 'summary.xlsx', (err) => {
                if (err) throw err;
                fs.unlinkSync(filePath); // ลบไฟล์เมื่อดาวน์โหลดเสร็จ
            });
        } else {
            return res.status(400).json({ error: 'Invalid format. Supported formats: json, csv, excel' });
        }
    } catch (err) {
        console.error('Error exporting summary:', err);
        res.status(500).json({ error: 'Failed to export summary', details: err.message });
    }
};

exports.importData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const importedData = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => importedData.push(row))
            .on('end', () => {
                // ลบไฟล์หลังใช้งาน
                fs.unlinkSync(filePath);
                res.json({ message: 'Data imported successfully', data: importedData });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to import data' });
    }
};

const AppDataSource = require('../config/data-source');
const Account = require('../entities/account');

exports.createAccount = async (accountData) => {
    const accountRepository = AppDataSource.getRepository(Account);
    const newAccount = accountRepository.create(accountData);
    await accountRepository.save(newAccount);
    return newAccount;
};

exports.deleteAccount = async (accountId) => {
    const accountRepository = AppDataSource.getRepository(Account);
    const result = await accountRepository.delete(accountId);
    if (result.affected === 0) {
        throw new Error('Account not found');
    }
};

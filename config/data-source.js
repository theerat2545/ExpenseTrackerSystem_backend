require('dotenv').config();
const { DataSource } = require('typeorm');
const path = require('path');

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT), 
    synchronize: false, 
    logging: false,
    entities: [
        require(path.join(__dirname, '../entities/user')),
        require(path.join(__dirname, '../entities/account')), 
        require(path.join(__dirname, '../entities/categorie')), 
        require(path.join(__dirname, '../entities/transaction')), 
    ], 
    // migrations: [
    //     path.join(__dirname, '../src/migrations/1736790376406-AddAccountToCategories.js'), 
    // ],
    // subscribers: [
    //     path.join(__dirname, '../subscribers/*.js'), 
    // ],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
    })
    .catch((err) => {
        console.error('Error during database initialization:', err);
    });

module.exports = AppDataSource;

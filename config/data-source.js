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
    synchronize: true, 
    logging: false,
    entities: [require(path.join(__dirname, '../entities/user'))], 
});

module.exports = AppDataSource;

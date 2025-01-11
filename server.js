require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const AppDataSource = require('./config/data-source');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);

AppDataSource.initialize()
.then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch ((err) => {
    console.log(`Database connection error:`, err);
});
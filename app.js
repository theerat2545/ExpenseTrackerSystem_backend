require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');

const AppDataSource = require('./config/data-source');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
const secretkey = process.env.JWT_SECRET
app.use(session({
    secret: secretkey, // คีย์ที่ใช้สำหรับการเข้ารหัสเซสชัน
    resave: false,             // ไม่บันทึกเซสชันหากไม่มีการเปลี่ยนแปลง
    saveUninitialized: true,   // เก็บเซสชันที่ไม่ได้ใช้งาน
    cookie: { secure: false }  // หากใช้งาน HTTPS ให้ตั้งเป็น true
  }));

// Connect to the database
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
    });

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

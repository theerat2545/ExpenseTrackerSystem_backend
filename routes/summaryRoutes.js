const express = require('express');
const multer = require('multer');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

const {
    getFilter,
    reportSummary,
    exportSummary,
    importData,
} = require('../controllers/summaryController');

const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/filter', authenticate, getFilter);
router.get('/report', authenticate, reportSummary);
router.post('/export', authenticate, exportSummary);
router.post('/import', authenticate, upload.single('file'), importData);

module.exports = router;

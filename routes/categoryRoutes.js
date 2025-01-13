const express = require('express');

const {
    getCategories,
    createCategory,
    deleteCategory,
} = require('../controllers/categoryController');

const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const categoryValidator = require('../validators/categoryValidator');

const router = express.Router();

router.get('/', authenticate, getCategories);
router.post('/', authenticate, validate(categoryValidator), createCategory);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;

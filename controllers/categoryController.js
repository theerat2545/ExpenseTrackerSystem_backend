const AppDataSource = require('../config/data-source');
const userRepository = AppDataSource.getRepository('User');
const Category = require('../entities/categorie');

const categoryRepository = AppDataSource.getRepository(Category);

exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { user_id, name, type } = req.body;

        // ตรวจสอบว่าผู้ใช้มีอยู่จริง
        const user = await userRepository.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid user_id. User does not exist.' });
        }

        // สร้าง Category ใหม่
        const newCategory = categoryRepository.create({ name, type, user });
        await categoryRepository.save(newCategory);

        res.status(201).json(newCategory);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Failed to create category', details: err.message });
    }
};



exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryRepository.delete(id);
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete category', details: err.message });
    }
};

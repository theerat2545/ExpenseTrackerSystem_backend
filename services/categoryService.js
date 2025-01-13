const AppDataSource = require('../config/data-source');
const Category = require('../entities/categorie');

exports.createCategory = async (categoryData) => {
    const categoryRepository = AppDataSource.getRepository(Category);
    const existingCategory = await categoryRepository.findOne({ where: { name: categoryData.name } });
    if (existingCategory) {
        throw new Error('Category already exists');
    }

    const newCategory = categoryRepository.create(categoryData);
    await categoryRepository.save(newCategory);
    return newCategory;
};

exports.deleteCategory = async (categoryId) => {
    const categoryRepository = AppDataSource.getRepository(Category);
    const result = await categoryRepository.delete(categoryId);
    if (result.affected === 0) {
        throw new Error('Category not found');
    }
};

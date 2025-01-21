const Category = require('../Model/categoryModel');

const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name, parentCategory });
    await category.save();

    return res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: error });
  }
};

const getCategories = async (req, res) => {
  try {
    const parentCategory = req.query.parentCategory;

    const categories = parentCategory
      ? await Category.find({ parentCategory })
      : await Category.find();

    return res.status(200).json({ categories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getRootCategories = async (req, res) => {
  try {
    const rootCategories = await Category.find({ parentCategory: null });

    if (!rootCategories) {
      return res.status(400).json({ message: 'No categories found' });
    }

    return res.status(200).json(rootCategories);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const { parent_id } = req.params;

    const subCategories = await Category.find({ parentCategory: parent_id });

    if (!subCategories) {
      return res.status(400).json({ message: 'No Categoires Found yet' });
    }

    return res.status(200).json(subCategories);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getRootCategories,
  getSubCategories,
};

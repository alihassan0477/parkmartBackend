const express = require('express');
const router = express.Router();
const categoryController = require('../controller/ categoryController');

router.post('/api/create-categories', categoryController.createCategory); // Create a category
router.get('/api/categories/root', categoryController.getRootCategories);
router.get('/api/get-categories', categoryController.getCategories); // Get all categories
router.get(
  '/api/subCategories/:parent_id',
  categoryController.getSubCategories
); // Get all categories

module.exports = router;

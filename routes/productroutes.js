const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.post('/api/create-product', productController.createProduct);
router.get('/api/get-product', productController.getProduct);
router.get('/api/get-all-products', productController.getAllproducts);
router.get(
  '/api/get-product-by-category/:category',
  productController.getProductsByCategory
);

module.exports = router;

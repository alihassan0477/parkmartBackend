const express = require('express');
const sellerController = require('../controller/sellerController'); // Path to the controller

const router = express.Router();

// Define routes for sellers
router.post('/api/create-seller', sellerController.createSeller); // Create a new seller
router.get('/api/get-seller', sellerController.getAllSellers); // Get all sellers
router.get('/api/get-seller/:id', sellerController.getSellerById); // Get a single seller by ID
router.post('/api/loginSeller', sellerController.loginSeller); // Create a new seller

module.exports = router;

// router.put('/:id', sellerController.updateSeller); // Update a seller by ID
// router.delete('/:id', sellerController.deleteSeller); // Delete a seller by ID

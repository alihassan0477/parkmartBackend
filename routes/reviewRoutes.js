const express = require('express');
const router = express.Router();
const reviewController = require('../controller/ReviewController');

router.post('/api/create-review', reviewController.createReview);
router.get(
  '/api/get-Review-by-productId/:product_id',
  reviewController.getReviewbyproductId
);

module.exports = router;

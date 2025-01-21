const mongoose = require('mongoose');

const ReviewsSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model('Review', ReviewsSchema);

module.exports = Review;

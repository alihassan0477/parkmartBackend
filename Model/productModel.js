const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  images: [
    {
      type: String,
      trim: true,
    },
  ],
  specifications: [specificationSchema], // Added Specifications Field
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

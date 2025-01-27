const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: String,

  phoneNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  CNIC: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  residentialAdress: {
    type: String,
    required: true,
    trim: true,
  },
  storeName: {
    type: String,
    required: true,
    trim: true,
  },
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;

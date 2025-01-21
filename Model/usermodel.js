const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: { type: String, unique: true, required: true },
  password: String,
  address: {
    type: String,
    required: false,
    default: null,
  },
  imgURL: {
    type: String,
    required: false,
    default: null,
  },

  country: {
    type: String,
    enum: ['Pakistan', 'India', 'Dubai'],
  },

  Gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

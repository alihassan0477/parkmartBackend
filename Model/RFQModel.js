const mongoose = require('mongoose');

const RFQSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  custom_title: {
    type: String,
    required: true,
    trim: true,
  },

  product_required: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  deliveryTime: {
    type: String,
    required: true,
  },

  Location: {
    type: String,
    required: true,
  },

  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },

  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  status: {
    type: String,
    enum: ['FreshLead', 'OrderReceived', 'OrderClosed', 'LeadRejected'],
    default: 'FreshLead',
  },
});

const RFQ = mongoose.model('RFQ', RFQSchema);

module.exports = RFQ;

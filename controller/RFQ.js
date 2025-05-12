const RFQ = require('../Model/RFQModel');
const Product = require('../Model/productModel');
const mongoose = require('mongoose');

exports.createRFQ = async (req, res) => {
  try {
    const {
      title,
      custom_title,
      productname,
      quantity,
      deliveryTime,
      Location,
      customer_id,
    } = req.body;

    const product = await Product.findOne({ name: productname });

    if (!product) {
      return res.status(404).json({ message: 'Product does not exist' });
    }

    const RFQOfCustomer = await RFQ.findOne({
      product_required: product._id,
      customer_id: customer_id,
    });

    if (RFQOfCustomer) {
      return res
        .status(403)
        .json({ message: 'The Person already sended RFQ for this product' });
    }

    const rfq = new RFQ({
      title: title,
      custom_title: custom_title,
      deliveryTime: deliveryTime,
      product_required: product._id,
      quantity: quantity,
      seller_id: product.seller,
      customer_id: customer_id,
      Location: Location,
    });

    await rfq.save();

    return res.status(201).json({ message: 'RFQ created successfully', rfq });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating RFQ', error });
  }
};

exports.getRFQsBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;

    console.log(sellerId);

    if (!sellerId) {
      return res
        .status(400)
        .json({ message: 'sellerId parameter is required' }); // 400 Bad Request
    }

    const rfqs = await RFQ.find({ seller_id: sellerId });

    if (!rfqs || rfqs.length === 0) {
      return res
        .status(404)
        .json({ message: `No RFQs found for sellerId: ${sellerId}` }); // 404 Not Found
    }

    return res.status(200).json(rfqs); // 200 OK
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' }); // 500 Internal Server Error
  }
};

exports.getTotalRFQsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const rfqs = await RFQ.find({ seller_id: sellerId });
    const total = await RFQ.countDocuments({ seller_id: sellerId });

    res.status(200).json({
      success: true,
      total,
      rfqs,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { rfqId } = req.params;
  const { status } = req.body;

  try {
    const updatedRFQ = await RFQ.findByIdAndUpdate(
      rfqId,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedRFQ) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    res
      .status(200)
      .json({ message: 'Status updated successfully', data: updatedRFQ });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error updating status', error: error.message });
  }
};

exports.getStatusCountsBySeller = async (req, res) => {
  const { sellerId } = req.params; // sellerId comes from route param

  console.log(sellerId);

  try {
    const result = await RFQ.aggregate([
      {
        $match: {
          seller_id: new mongoose.Types.ObjectId(sellerId),
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert result array into object like { FreshLead: count, ... }
    const counts = result.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Ensure all possible statuses are present (even if 0)
    const allStatuses = [
      'FreshLead',
      'OrderReceived',
      'OrderClosed',
      'LeadRejected',
    ];
    const finalCounts = {};
    allStatuses.forEach((status) => {
      finalCounts[status] = counts[status] || 0;
    });

    res.status(200).json({ sellerId, statusCounts: finalCounts });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching status counts', error: error.message });
  }
};

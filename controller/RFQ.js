const RFQ = require('../Model/RFQModel');
const Product = require('../Model/productModel');

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

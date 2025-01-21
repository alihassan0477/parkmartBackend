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

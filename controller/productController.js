const Product = require('../Model/productModel');
const Category = require('../Model/categoryModel');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      description,
      seller,
      images,
      specifications,
    } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      description,
      seller,
      images,
      specifications,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(200).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

const getAllproducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name') // Populate the category field
      .populate('seller'); // Populate the seller field

    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to get a product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID and populate the seller field
    const product = await Product.findById(id).populate('seller');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryFound = await Category.findOne({ name: category });

    if (!categoryFound) {
      return res
        .status(404)
        .json({ message: `${category} category not found` });
    }

    const products = await Product.find({
      category: categoryFound._id,
    })
      .populate(['seller'])
      .populate('category', 'name');

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found in the ${category} category` });
    }

    // Step 4: Return the products as a response
    res.status(200).json({ products });
  } catch (err) {
    // Handle any errors that occur
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductsBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const products = await Product.find({ seller: sellerId }).populate([
      'category',
      'seller',
    ]);

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found for this seller.' });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { sellerId } = req.query;

  if (!sellerId) {
    return res.status(400).json({ message: 'sellerId is required' });
  }

  try {
    const product = await Product.findOneAndDelete({
      _id: id,
      seller: sellerId,
    });

    console.log(product);

    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found or unauthorized' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllproducts,
  getProductsByCategory,
  deleteProduct,
  getProductsBySellerId,
};

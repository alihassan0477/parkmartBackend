const Seller = require('../Model/sellerModel');

exports.createSeller = async (req, res) => {
  try {
    const seller = new Seller(req.body);
    await seller.save();
    res.status(201).json({ success: true, data: seller });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json({ success: true, data: sellers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: 'Seller not found' });
    }
    res.status(200).json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: 'Seller not found' });
    }
    res.status(200).json({ success: true, data: seller });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: 'Seller not found' });
    }
    res.status(200).json({ success: true, message: 'Seller deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

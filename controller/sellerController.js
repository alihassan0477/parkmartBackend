const Seller = require('../Model/sellerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createSeller = async (req, res) => {
  const { password, ...otherData } = req.body;

  try {
    // Check if the email, phone number, or CNIC already exists
    const existingSeller = await Seller.findOne({
      $or: [
        { email: otherData.email },
        { phoneNo: otherData.phoneNo },
        { CNIC: otherData.CNIC },
      ],
    });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        error: 'Email, phone number, or CNIC already exists.',
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new seller with hashed password and other data
    const seller = new Seller({
      ...otherData,
      password: hashedPassword, // Store the hashed password
    });

    // Save the seller to the database
    await seller.save();

    // Respond with success
    res.status(200).json({ success: true, data: seller });
  } catch (error) {
    // Handle errors
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

exports.loginSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the seller by email
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({
        success: false,
        error: 'Seller with this email does not exist.',
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, seller.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password.',
      });
    }

    // Generate a JWT token for the seller
    const token = jwt.sign({ sellerId: seller._id }, 'yourSecretKey', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Respond with success and the JWT token
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token, // Send the token to the client
      sellerId: seller._id,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, error: error.message });
  }
};
// exports.Sellerlogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const seller = await Seller.findOne({ email });
//     console.log(seller);
//     if (!seller) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     const isPasswordValid = await bcrypt.compare(password, seller.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ sellerId: seller._id }, 'your-secret-key');

//     res.status(200).json({ token, _id: seller._id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

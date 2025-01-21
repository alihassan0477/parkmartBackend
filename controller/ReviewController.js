const Review = require('../Model/ReviewsModel');

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);

    if (!review) {
      return res.status(400).json({ message: 'Review not created' });
    }

    return res.status(200).json({ message: 'Review Created Successfully' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getReviewbyproductId = async (req, res) => {
  const { product_id } = req.params; // Correct object destructuring
  try {
    const reviews = await Review.find({ product_id }).populate(
      'customer_id',
      'username'
    );

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

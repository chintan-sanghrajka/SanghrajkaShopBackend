import ReviewModel from "../models/review.model.js";
// Testing done
export const addReview = async (req, res) => {
  const { productId, review, userName } = req.body;
  const date = new Date();
  const createdDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  try {
    const newReview = new ReviewModel({
      productId: productId,
      userName: userName,
      custReview: review,
      createdDate: createdDate,
      status: 1,
    });
    newReview.save();
    if (newReview) {
      res.status(201).json({
        message: "Review added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const getReview = async (req, res) => {
  const { productId, page, limit } = req.body;
  const skipNo = Number(page) === 1 ? 0 : (Number(page) - 1) * limit;
  try {
    const reviewCount = await ReviewModel.find({
      productId: productId,
      status: 1,
    });
    const reviews = await ReviewModel.find({
      productId: productId,
      status: 1,
    })
      .limit(limit)
      .skip(skipNo);
    res.status(200).json({
      reviews: reviews,
      message: "Reviews fetched successfully.",
      reviewCount: reviewCount.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const deleteReview = async (req, res) => {
  const { reviewId } = req.query;
  try {
    const newReview = await ReviewModel.updateOne(
      {
        _id: reviewId,
      },
      {
        $set: {
          status: 9,
        },
      }
    );
    if (newReview.acknowledged) {
      res.status(200).json({
        message: "Review deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

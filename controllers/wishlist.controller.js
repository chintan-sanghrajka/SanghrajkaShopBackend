import WishListModel from "../models/wishlist.model.js";
// Testing done
export const addProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.cookies.user._id;
  try {
    const product = await WishListModel.findOne({
      userId: userId,
      productId: productId,
      status: 1,
    });
    if (product) {
      res.status(409).json({
        message: "Product exists.",
      });
    } else {
      const product = new WishListModel({
        userId: userId,
        productId: productId,
        status: 1,
      });
      product.save();
      if (product) {
        res.status(201).json({
          message: "Product successfully added.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing done
export const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.cookies.user._id;
  try {
    const product = await WishListModel.updateOne(
      {
        userId: userId,
        productId: productId,
      },
      {
        $set: {
          status: 9,
        },
      }
    );
    if (product.acknowledged) {
      res.status(200).json({
        message: "Product deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing done
export const getProduct = async (req, res) => {
  const { page, limit } = req.body;
  const userId = req.cookies.user._id;
  const skipNo = Number(page) === 1 ? 0 : (Number(page) - 1) * limit;
  try {
    const productCount = await WishListModel.find({
      userId: userId,
      status: 1,
    });
    const product = await WishListModel.find({
      userId: userId,
      status: 1,
    })
      .populate({
        path: "productId",
        select: "name price thumbnail",
      })
      .limit(limit)
      .skip(skipNo);
    res.status(200).json({
      products: product,
      message: "Products fetched successfully.",
      productCount: productCount.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

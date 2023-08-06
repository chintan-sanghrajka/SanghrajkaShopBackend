import CartModel from "./../models/cart.model.js";
import mongoose from "mongoose";
import ProductModel from "./../models/product.model.js";
// Testing Done
export const addProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.cookies.user._id;
    const oldProduct = await CartModel.findOne({
      userId: userId,
      productId: productId,
    });
    if (oldProduct) {
      if (oldProduct.count === 10) {
        res.status(400).json({
          message: "Only 10 items are allowed.",
        });
      } else {
        const updateProduct = await CartModel.updateOne(
          {
            userId: userId,
            productId: productId,
          },
          {
            $set: {
              count: oldProduct.count + 1,
            },
          }
        );
        if (updateProduct.acknowledged) {
          res.status(200).json({
            message: "Count updated successfully.",
          });
        }
      }
    } else {
      const product = new CartModel({
        userId: userId,
        productId: productId,
        status: 1,
      });
      product.save();
      if (product) {
        res.status(201).json({
          message: "Product added to Cart successfully.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const getProduct = async (req, res) => {
  const { page, limit } = req.body;
  const userId = req.cookies.user._id;
  const skipNo = Number(page) === 1 ? 0 : (Number(page) - 1) * limit;
  try {
    // const product = await CartModel.find({
    //   userId: userId,
    //   status: 1,
    // })
    //   .populate("productId")
    //   .limit(limit)
    //   .skip(skipNo);

    const product = await CartModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 1,
        },
      },
      {
        $project: {
          count: "$count",
          name: "$product.name",
          price: "$product.price",
          thumbnail: "$product.thumbnail",
        },
      },
      {
        $limit: Number(limit),
      },
      {
        $skip: skipNo,
      },
    ]);

    const productCount = await CartModel.find({
      userId: userId,
      status: 1,
    });
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
// Testing Done
export const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.cookies.user._id;
  try {
    const product = CartModel.updateOne(
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
    if ((await product).acknowledged) {
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
// Testing Done
export const updateProduct = async (req, res) => {
  const { productId, action } = req.body;
  const userId = req.cookies.user._id;
  try {
    const product = await CartModel.findOne({
      userId: userId,
      productId: productId,
    });
    if (action === "inc") {
      if (product.count === 10) {
        res.status(400).json({
          message: "Only 10 items are allowed.",
        });
      } else {
        const newProduct = await CartModel.updateOne(
          { userId: userId, productId: productId },
          {
            $set: {
              count: product.count + 1,
            },
          }
        );
        if (newProduct.acknowledged) {
          res.status(200).json({
            message: "Count updated successfully.",
          });
        }
      }
    }
    if (action === "dec") {
      if (product.count === 1) {
        const newProduct = await CartModel.updateOne(
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
        if (newProduct.acknowledged) {
          res.status(200).json({
            message: "Count updated successfully.",
          });
        }
      } else {
        const newProduct = await CartModel.updateOne(
          {
            userId: userId,
            productId: productId,
          },
          {
            $set: {
              count: product.count - 1,
            },
          }
        );
        if (newProduct.acknowledged) {
          res.status(200).json({
            message: "Count updated successfully.",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const buyProduct = async (req, res) => {
  const { productId, count } = req.body;
  try {
    const [product] = await ProductModel.find({
      _id: productId,
    });
    const currStock = product.stock;
    console.log(product.stock);
    if (product.stock < count) {
      res.status(400).json({
        message: "Product out of Stock.",
      });
    } else {
      console.log("Hii");
      const product = await ProductModel.updateOne(
        {
          _id: productId,
        },
        {
          $set: {
            stock: currStock - count,
          },
        }
      );
      if (product.acknowledged) {
        res.status(200).json({
          message: "Order placed successfully.",
          remainingCount: product.stock,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

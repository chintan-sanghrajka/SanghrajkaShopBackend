import CartModel from "./../models/cart.model.js";
import mongoose from "mongoose";
import ProductModel from "./../models/product.model.js";
// Testing Done
export const addProduct = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const oldProduct = await CartModel.findOne({
      userId: userId,
      productId: productId,
      status: 1,
    });
    if (oldProduct) {
      if (oldProduct.count === 10) {
        res.status(200).json({
          message: "Only 10 items are allowed.",
          max: true,
        });
      } else {
        const updateProduct = await CartModel.updateOne(
          {
            userId: userId,
            productId: productId,
            status: 1,
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
            max: false,
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
          max: false,
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
  const { page, limit, userId } = req.body;
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
          description: "$product.description",
          price: "$product.price",
          stock: "$product.stock",
          thumbnail: "$product.thumbnail",
          productId: "$productId",
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
  const { cartId } = req.body;
  console.log(cartId);
  try {
    const product = await CartModel.updateOne(
      {
        _id: cartId,
        status: 1,
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
// Testing Done
export const updateProduct = async (req, res) => {
  const { productId, action, userId } = req.body;
  try {
    const product = await CartModel.findOne({
      userId: userId,
      productId: productId,
      status: 1,
    });
    if (action === "inc") {
      if (product.count === 10) {
        res.status(400).json({
          message: "Only 10 items are allowed.",
        });
      } else {
        const newProduct = await CartModel.updateOne(
          { userId: userId, productId: productId, status: 1 },
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
            status: 1,
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
            status: 1,
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
  const { productId, count, userId } = req.body;
  try {
    const [product] = await ProductModel.find({
      _id: productId,
    });
    const currStock = product.stock;
    if (product.stock < count) {
      res.status(400).json({
        message: "Product out of Stock.",
      });
    } else {
      const product = await ProductModel.updateOne(
        {
          _id: productId,
          status: 1,
        },
        {
          $set: {
            stock: currStock - count,
          },
        }
      );
      if (product.acknowledged) {
        const cart = await CartModel.updateOne(
          {
            userId: userId,
            productId: productId,
            status: 1,
          },
          {
            $set: {
              status: 9,
            },
          }
        );
        if (cart.acknowledged) {
          res.status(200).json({
            message: "Order placed successfully.",
            remainingCount: product.stock,
          });
        } else {
          res.status(500).json({
            message: "Some error occurred.",
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

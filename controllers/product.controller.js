import ProductModel from "./../models/product.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/product")) {
      cb(null, "./uploads/product");
    } else {
      fs.mkdirSync("./uploads/product", true);
      cb(null, "./uploads/product");
    }
  },
  filename: function (req, file, cb) {
    const imgName = file.originalname;
    const imgArr = imgName.split(".");
    imgArr.pop();
    const imgExt = path.extname(imgName);
    const fname = imgArr.join(".") + "-" + Date.now() + imgExt;
    cb(null, fname);
  },
});

const upload = multer({ storage: storage });
// Testing Done
export const addProduct = (req, res) => {
  try {
    const uploadFile = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]);

    uploadFile(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const {
        name,
        description,
        categoryId,
        subCategoryId,
        quantity,
        stock,
        keys,
        price,
      } = req.body;
      const vendorId = req.cookies.user._id;
      let thumbnail = "";
      let images = [];
      if (req.files !== undefined) {
        thumbnail = req.files["thumbnail"][0].filename;
        images = req.files["images"];
      }

      const productModel = new ProductModel({
        name: name,
        description: description,
        categoryId: categoryId,
        subCategoryId: subCategoryId,
        vendorId: vendorId,
        quantity: quantity,
        stock: stock,
        keys: keys,
        price: price,
        thumbnail: thumbnail,
        images: images,
        status: 1,
        createdAt: new Date(),
      });
      productModel.save();

      if (productModel) {
        res.status(201).json({
          data: productModel,
          message: "Product added successfully.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const getProductCat = async (req, res) => {
  const cookieData = req.cookies.user._id;
  console.log(cookieData);
  const { subCategoryId, page, limit } = req.body;
  const userId = req.cookies.user._id;
  const role = req.cookies.user.role;
  const skipNo = Number(page) === 1 ? 0 : (Number(page) - 1) * limit;
  try {
    if (Number(role) === 2) {
      const productList = await ProductModel.find({
        subCategoryId: subCategoryId,
        status: 1,
      })
        .limit(limit)
        .skip(skipNo);
      const productCount = await ProductModel.find({
        subCategoryId: subCategoryId,
        status: 1,
      });
      res.status(200).json({
        productList: productList,
        message: `products fetched successfully.`,
        productCount: productCount.length,
      });
    } else if (Number(role) === 3) {
      const productList = await ProductModel.find({
        status: 1,
        vendorId: userId,
        subCategoryId: subCategoryId,
      })
        .limit(limit)
        .skip(skipNo);
      const productCount = await ProductModel.find({
        status: 1,
        vendorId: userId,
        subCategoryId: subCategoryId,
      });
      res.status(200).json({
        productList: productList,
        message: "Products fetched successfully.",
        productCount: productCount.length,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const getProducts = async (req, res) => {
  const { keys, page, limit } = req.body;
  const userId = req.cookies.user._id;
  const role = req.cookies.user.role;
  const skipNo = Number(page) === 1 ? 0 : (Number(page) - 1) * limit;
  try {
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(keys);

    var filterConfig = { status: 1 };
    if (keys != undefined) {
      filterConfig = {
        ...filterConfig,
        $or: [{ keys: { $regex: searchRgx, $options: "i" } }],
      };
    }
    if (Number(role) === 2) {
      const productsList = await ProductModel.find(filterConfig)
        .limit(limit)
        .skip(skipNo);

      const productCount = await ProductModel.find(filterConfig);

      res.status(200).json({
        productList: productsList,
        message: "products fetched successfully.",
        productCount: productCount.length,
      });
    } else if (Number(role) === 3) {
      const productList = await ProductModel.find({
        ...filterConfig,
        vendorId: userId,
      })
        .limit(limit)
        .skip(skipNo);
      const productCount = await ProductModel.find({
        ...filterConfig,
        vendorId: userId,
      });
      res.status(200).json({
        productList: productList,
        message: "Products fetched successfully.",
        productCount: productCount.length,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const deleteProduct = async (req, res) => {
  const { productId } = req.query;
  try {
    const product = await ProductModel.updateOne(
      { _id: productId },
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
// Testing done userId
export const updateProduct = async (req, res) => {
  try {
    const uploadFile = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]);
    uploadFile(req, res, async function (err) {
      if (err)
        return res.status(400).json({
          message: err.message,
        });
      const {
        _id,
        name,
        description,
        categoryId,
        subCategoryId,
        quantity,
        stock,
        keys,
        price,
      } = req.body;
      const vendorId = req.cookies.user._id;
      const productData = await ProductModel.findOne({ _id: _id });
      let thumbnail = productData.thumbnail;
      let images = productData.images;
      if (req.file !== undefined) {
        thumbnail = req.files["thumbnail"][0].filename;
        images = req.files["images"];
        if (fs.existsSync("./uploads/product/" + productData.avatar)) {
          fs.unlinkSync("./uploads/product/" + productData.avatar);
        }
      }
      const product = await ProductModel.updateOne(
        { _id: _id },
        {
          $set: {
            name: name,
            description: description,
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            vendorId: vendorId,
            quantity: quantity,
            stock: stock,
            keys: keys,
            price: price,
            thumbnail: thumbnail,
            images: images,
            status: 1,
          },
        }
      );
      if (product.acknowledged) {
        res.status(200).json({
          message: "data updated successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: message.error,
    });
  }
};
// Testing done
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    const product = await ProductModel.find({
      _id: productId,
    });
    res.status(200).json({
      message: "Product Fetched Successfully.",
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

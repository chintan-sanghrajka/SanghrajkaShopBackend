import CategoryModel from "./../models/category.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/category")) {
      cb(null, "./uploads/category");
    } else {
      fs.mkdirSync("./uploads/category", true);
      cb(null, "./uploads/category");
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
export const addCategory = (req, res) => {
  try {
    const uploadFile = upload.single("cover");

    uploadFile(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { name, description } = req.body;
      let cover = "";
      if (req.file !== undefined) {
        cover = req.file.filename;
      }
      const categoryData = new CategoryModel({
        name: name,
        description: description,
        cover: cover,
        status: 1,
      });
      categoryData.save();

      if (categoryData) {
        return res.status(201).json({
          data: categoryData,
          message: "Category added seccessfully.",
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
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ status: 1 });
    res.status(200).json({
      message: "Categories fetched successfully.",
      categories: categories,
      count: categories.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  console.log(categoryId);
  try {
    const category_data = await CategoryModel.updateOne(
      {
        _id: categoryId,
      },
      {
        $set: {
          status: 9,
        },
      }
    );
    if (category_data.acknowledged) {
      res.status(200).json({
        message: "Category deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const updateCategory = async (req, res) => {
  try {
    const uploadFile = upload.single("cover");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { name, description, _id } = req.body;

      const categoryOld = await CategoryModel.find({
        _id: _id,
      });

      let cover = categoryOld.cover;
      if (req.file !== undefined) {
        cover = req.file.filename;
        if (fs.existsSync("./uploads/category" + categoryOld.cover)) {
          fs.unlinkSync("./uploads/category" + categoryOld.cover);
        }
      }
      const categoryData = await CategoryModel.updateOne(
        { _id: _id },
        {
          $set: {
            name: name,
            description: description,
            cover: cover,
            status: 1,
          },
        }
      );
      if (categoryData.acknowledged) {
        return res.status(200).json({
          message: "Category Updated Successfully.",
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
export const getCategory = async (req, res) => {
  try {
    const { name } = req.query;
    const category = await CategoryModel.findOne({
      name: name,
      status: 1,
    });
    if (category) {
      res.status(200).json({
        message: "Category fetched successfully.",
        category: category,
      });
    } else {
      res.status(400).json({
        message: "Category Not Found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

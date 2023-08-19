import SubCategoryModel from "./../models/subCategory.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/subCategory")) {
      cb(null, "./uploads/subCategory");
    } else {
      fs.mkdirSync("./uploads/subCategory", true);
      cb(null, "./uploads/subCategory");
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
export const addSubCategory = (req, res) => {
  try {
    const uploadFile = upload.single("cover");

    uploadFile(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { name, description, categoryId } = req.body;
      let cover = "";
      if (req.file !== undefined) {
        cover = req.file.filename;
      }
      const subCategory = new SubCategoryModel({
        name: name,
        description: description,
        categoryId: categoryId,
        cover: cover,
        status: 1,
      });
      subCategory.save();

      if (subCategory) {
        return res.status(201).json({
          data: subCategory,
          message: "Sub-Category added seccessfully.",
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
export const getSubCategories = async (req, res) => {
  const { categoryId } = req.body;
  try {
    const subCategories = await SubCategoryModel.find({
      status: 1,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "Sub-Categories Fetched Successfully.",
      subCategories: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const getSubCategory = async (req, res) => {
  const { subCategoryId } = req.query;
  try {
    const subCategory = await SubCategoryModel.findOne({
      _id: subCategoryId,
    });
    res.status(200).json({
      subCategoryData: subCategory,
      message: "Sub-Category Fetched Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const deleteSubCategory = async (req, res) => {
  const { subCategoryId } = req.query;
  try {
    const subCategoryData = await SubCategoryModel.updateOne(
      {
        _id: subCategoryId,
      },
      {
        $set: {
          status: 9,
        },
      }
    );
    if (subCategoryData.acknowledged) {
      res.status(200).json({
        message: "Sub-Category Deleted Successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const updateSubCategory = async (req, res) => {
  try {
    const uploadFile = upload.single("cover");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { name, description, _id, categoryId } = req.body;

      const subCategoryOld = await SubCategoryModel.findOne({
        _id: _id,
      });

      let cover = subCategoryOld.cover;
      if (req.file !== undefined) {
        cover = req.file.filename;
        if (fs.existsSync("./uploads/subCategory" + subCategoryOld.cover)) {
          fs.unlinkSync("./uploads/subCategory" + subCategoryOld.cover);
        }
      }
      const subCategoryData = await SubCategoryModel.updateOne(
        { _id: _id },
        {
          $set: {
            name: name,
            categoryId: categoryId,
            description: description,
            cover: cover,
            status: 1,
          },
        }
      );
      if (subCategoryData.acknowledged) {
        return res.status(200).json({
          message: "Sub-Category Updated Successfully.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

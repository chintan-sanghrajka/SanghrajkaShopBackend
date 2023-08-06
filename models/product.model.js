import mongoose from "mongoose";
import CategoryModel from "./category.model.js";
import SubCategoryModel from "./subCategory.model.js";
import UserModel from "./user.model.js";

const Schema = mongoose.Schema;

const ProductModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: CategoryModel,
  },
  subCategoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: SubCategoryModel,
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: UserModel,
  },
  quantity: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  keys: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

export default mongoose.model("products", ProductModel);

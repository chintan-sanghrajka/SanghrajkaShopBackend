import mongoose from "mongoose";
import ProductModel from "./../models/product.model.js";
import userModel from "./user.model.js";

const Schema = mongoose.Schema;

const WishListModel = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: userModel,
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ProductModel,
  },
  status: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("wishlists", WishListModel);

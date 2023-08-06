import mongoose from "mongoose";
import ProductModel from "./product.model.js";

const Schema = mongoose.Schema;

const ReviewModel = new Schema({
  userName: {
    type: String,
    required: true,
  },
  custReview: {
    type: String,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ProductModel,
  },
  createdDate: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("reviews", ReviewModel);

import mongoose from "mongoose";
import ProductModel from "./product.model";
import UserModel from "./user.model.js";

const Schema = mongoose.Schema;

const CartModel = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: UserModel,
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
  count: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("carts", CartModel);

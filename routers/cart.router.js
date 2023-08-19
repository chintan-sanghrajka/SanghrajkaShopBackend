import express from "express";
import {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  buyProduct,
} from "./../controllers/cart.controller.js";
import auth from "./../middleware/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.post("/add-product-to-cart", auth, addProduct);

cartRouter.post("/get-cart-products", auth, getProduct);

cartRouter.post("/delete-from-cart", auth, deleteProduct);

cartRouter.put("/update-cart", auth, updateProduct);

cartRouter.post("/buy-product", auth, buyProduct);

export default cartRouter;

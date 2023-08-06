import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
} from "./../controllers/wishlist.controller.js";
import auth from "./../middleware/auth.middleware.js";

const wishListRouter = express.Router();

wishListRouter.post("/add-product-to-wishlist", auth, addProduct);

wishListRouter.delete("/delete-product-from-cart", auth, deleteProduct);

wishListRouter.get("/get-products-from-wishlist", auth, getProduct);

export default wishListRouter;

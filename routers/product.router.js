import {
  addProduct,
  deleteProduct,
  getProductCat,
  getProducts,
  updateProduct,
  getProduct,
} from "./../controllers/product.controller.js";
import express from "express";
import auth from "./../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.post("/add-product", auth, addProduct);

productRouter.get("/get-products-cat", auth, getProductCat);

productRouter.get("/get-products", auth, getProducts);

productRouter.delete("/delete-product", auth, deleteProduct);

productRouter.put("/update-product", auth, updateProduct);

productRouter.get("/get-product", getProduct);

export default productRouter;

import {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getCategory,
} from "../controllers/category.controller.js";
import express from "express";
import auth from "./../middleware/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/add-category", auth, addCategory);

categoryRouter.get("/get-categories", auth, getCategories);

categoryRouter.delete("/delete-category", auth, deleteCategory);

categoryRouter.put("/update-category", auth, updateCategory);

categoryRouter.get("/get-category", auth, getCategory);

export default categoryRouter;

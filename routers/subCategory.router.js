import express from "express";
const subCategoryRouter = express.Router();
import {
  addSubCategory,
  getSubCategories,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import auth from "./../middleware/auth.middleware.js";

subCategoryRouter.post("/add-sub-category", auth, addSubCategory);

subCategoryRouter.get("/get-sub-categories", auth, getSubCategories);

subCategoryRouter.get("/get-sub-category", auth, getSubCategory);

subCategoryRouter.delete("/delete-sub-category", auth, deleteSubCategory);

subCategoryRouter.put("/update-sub-category", auth, updateSubCategory);

export default subCategoryRouter;

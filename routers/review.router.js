import express from "express";
import {
  addReview,
  deleteReview,
  getReview,
} from "./../controllers/review.controller.js";
import auth from "./../middleware/auth.middleware.js";

const reviewRouter = express.Router();

reviewRouter.post("/add-review", auth, addReview);

reviewRouter.post("/get-reviews", auth, getReview);

reviewRouter.delete("/delete-review", auth, deleteReview);

export default reviewRouter;

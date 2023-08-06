import express from "express";
import {
  checkUser,
  addUser,
  deleteUser,
  getUserWithOTP,
  getUser,
} from "../controllers/user.controller.js";
import auth from "./../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/check-user", checkUser);

userRouter.post("/signup", addUser);

userRouter.delete("/delete-user", auth, deleteUser);

userRouter.post("/login-otp", getUserWithOTP);

userRouter.post("/login", getUser);

export default userRouter;

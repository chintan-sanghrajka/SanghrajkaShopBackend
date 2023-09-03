import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRouter from "./routers/category.router.js";
import productRouter from "./routers/product.router.js";
import cartRouter from "./routers/cart.router.js";
import reviewRouter from "./routers/review.router.js";
import wishListRouter from "./routers/wishlist.router.js";
import userRouter from "./routers/user.router.js";
import subCategoryRouter from "./routers/subCategory.router.js";

const PORT = process.env.PORT;
const DBLink = process.env.DBLink;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log("Listening on port : " + PORT);
});

mongoose
  .connect(DBLink)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(categoryRouter);

app.use(productRouter);

app.use(cartRouter);

app.use(reviewRouter);

app.use(wishListRouter);

app.use(userRouter);

app.use(subCategoryRouter);

// Your code
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.resolve(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "client", "build", "index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
}
// Your code

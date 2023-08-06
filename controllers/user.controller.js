import UserModel from "./../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/users")) {
      cb(null, "./uploads/users");
    } else {
      fs.mkdirSync("./uploads/users", true);
      cb(null, "./uploads/users");
    }
  },
  filename: function (req, file, cb) {
    const imgName = file.originalname;
    const imgArr = imgName.split(".");
    imgArr.pop();
    const imgExt = path.extname(imgName);
    const fname = imgArr.join(".") + "-" + Date.now() + imgExt;
    cb(null, fname);
  },
});

const upload = multer({ storage: storage });
// Testing Done
export const checkUser = async (req, res) => {
  const { userName, emailId } = req.body;
  try {
    const oldUser = await UserModel.findOne({
      $and: [
        {
          userName: userName,
        },
        { status: 1 },
      ],
    });
    if (oldUser) {
      res.status(409).json({
        message: "User already exists.",
      });
    } else {
      const oldEmail = await UserModel.findOne({
        $and: [{ emailId: emailId }, { status: 1 }],
      });
      if (oldEmail) {
        res.status(409).json({
          message: "Email already exists.",
        });
      } else {
        res.status(200).json({
          message: "User not found.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const addUser = async (req, res) => {
  try {
    const uploadFile = upload.single("avatar");
    uploadFile(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const {
        firstName,
        lastName,
        userName,
        emailId,
        password,
        contact,
        role,
        vendorCompany,
      } = req.body;
      let avatar = "";
      if (req.file !== undefined) {
        avatar = req.file.filename;
      }

      const newPassword = bcrypt.hashSync(password, 10);
      const newUser = new UserModel({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        emailId: emailId,
        password: newPassword,
        status: 1,
        contact: contact,
        role: role,
        avatar: avatar,
        vendorCompany: vendorCompany,
      });
      newUser.save();
      if (newUser) {
        res.status(201).json({
          message: "User created successfully.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const deleteUser = async (req, res) => {
  const { userName } = req.body;
  try {
    const user = await UserModel.updateOne(
      {
        userName: userName,
      },
      {
        $set: {
          status: 9,
        },
      }
    );
    if (user.acknowledged) {
      res.status(200).json({
        message: "User Deleted Successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const getUser = async (req, res) => {
  const { userName, password, action } = req.body;
  try {
    const user = await UserModel.findOne({
      $and: [{ userName: userName }, { status: 1 }],
    });
    if (user) {
      if (action === "password") {
        const validPassword = bcrypt.compareSync(password, user.password);
        if (validPassword) {
          const token = jwt.sign(
            {
              userId: user._id,
              userName: user.userName,
              emailId: user.emailId,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          res.cookie("user", user);
          res.status(200).json({
            message: "User Successfully logged in.",
            user: user,
            token: token,
          });
        } else {
          res.status(400).json({
            message: "Invalid Password.",
          });
        }
      } else if (action === "otp") {
        const userOTP = Math.floor(
          Math.random() * (999999 - 100000 + 1) + 100000
        );
        const userWithOTP = await UserModel.updateOne(
          { userName: userName, status: 1 },
          { $set: { otp: userOTP } }
        );
        if (userWithOTP.acknowledged) {
          res.status(200).json({
            message: "User found, OTP authentication pending.",
            userOTP: userOTP,
          });
        } else {
          res.status(500).json({
            message: "some error occured.",
          });
        }
        expireOTP(userName);
      }
    } else {
      res.status(400).json({
        message: "User Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
export const getUserWithOTP = async (req, res) => {
  const { userName, userOTP } = req.body;
  try {
    const user = await UserModel.findOne({ userName: userName, status: 1 });
    if (user.otp === Number(userOTP)) {
      const token = jwt.sign(
        { userId: user._id, userName: user.userName, emailId: user.emailId },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.cookie("user", user);
      res.status(200).json({
        user: user,
        message: "User authenticated Successfully",
        token: token,
      });
    } else {
      res.status(400).json({
        message: "Invalid OTP.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Testing Done
const expireOTP = (userName) => {
  setTimeout(() => updateOTP(userName), 60000);
};
// Testing Done
const updateOTP = async (userName) => {
  await UserModel.updateOne(
    { userName: userName, status: 1 },
    {
      $set: {
        otp: 0,
      },
    }
  );
};

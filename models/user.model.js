import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModel = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    // Status 1: Active 2: Inactive
    type: Number,
    default: 1,
  },
  otp: {
    type: Number,
    default: 0,
  },
  contact: {
    type: Number,
    required: true,
  },
  role: {
    // 1: Admin 2: User 3: Vendor
    type: Number,
    required: true,
  },
  vendorCompany: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    defult: new Date(),
  },
  avatar: {
    type: String,
    default: "",
  },
});

export default mongoose.model("users", UserModel);

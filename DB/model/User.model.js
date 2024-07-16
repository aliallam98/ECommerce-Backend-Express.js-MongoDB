import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "userName is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: [],
    address:[],
    age:String,
    role: {
      type: String,
      default: "Customer",
      enum: ["Customer", "Admin", "Super-Admin", "Vendor"],
    },
    status: {
      type: String,
      default: "UnBlocked",
      enum: ["UnBlocked", "Blocked"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    profileImage: { secure_url: { type: String }, public_id: { type: String } },
    DOB: Date,
    OTPCode: {
      code: String,
      expireDate: Date,
    },
    OTPNumber: {
      type: Number,
      default: 0,
    },
    wishList: [{ type: Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;

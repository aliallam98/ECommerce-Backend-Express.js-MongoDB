import { Schema, model , Types } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    lastName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
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
    OTPNumber: {
      type: Number,
      default: 4,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    status: {
      type: String,
      default: "Offline",
      enum: ["Online", "Offline", "Blocked"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    image: { secure_url: { type: String }, public_id: { type: String } },
    DOB: Date,
    code: String,
    wishList:[
      {type : Types.ObjectId , ref:'Product'},
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;

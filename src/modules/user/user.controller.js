import userModel from "../../../DB/model/User.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const getWishList = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  console.log("11111");

  if (!userId)
    return next(new ErrorClass("Cannot access you have log in first", 401));

  const user = await userModel.findById(userId).populate({
    path: "wishList",
  });
  const wishList = user.wishList;

  // console.log("wishList", wishList);

  return res
    .status(200)
    .json({ success: true, message: "Done", results: wishList });
});

export const getPersonalInfo = asyncHandler(async (req, res, next) => {
  const userToFind = await userModel.findById(req.user._id);
  const payload = {
    fullName: userToFind.fullName,
    address: userToFind.address,
    age: userToFind.age,
    email: userToFind.email,
    profileImage: userToFind.profileImage,
    phone: userToFind.phone,
  };
  return res
    .status(200)
    .json({ success: true, message: "Done", results: payload });
});

export const updatePersonalInfo = asyncHandler(async (req, res, next) => {

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-commerce/UsersImages/${
          req.user.fullName + " " + req.user._id
        }`,
      }
    );
    req.body.profileImage = { secure_url, public_id };
  }
  const userToUpdate = await userModel.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true }
  );
  if (!userToUpdate) return next(new ErrorClass("Not Found", 404));
  return res.status(200).json({ success: true, message: "Updated" });
});

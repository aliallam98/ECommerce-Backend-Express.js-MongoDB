import slugify from "slugify";
import { asyncHandler } from "../../utils/errorHandling.js";
import couponModel from "../../../DB/model/Coupon.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { deleteOneById, getOneById } from "../../utils/code.handler.js";

export const addNewcoupon = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const isExist = await couponModel.findOne({ name });
  if (isExist) {
    return next(new Error("This coupon is Exist", { cause: 409 }));
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-commerce/coupon/${name}`,
      }
    );
    req.body.image = { secure_url, public_id };
  }
  req.body.createdBy =  req.user._id

  const coupon = await couponModel.create(req.body);
  return res.status(201).json({ message: "Done", coupon });
});
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.name = req.body.name;

  const isExist = await couponModel.findById(id);
  if (!isExist) {
    return next(new Error("This coupon is Not Exist", {cause:400}));
  }
  const checkCouponName = await couponModel.findOne({
    name:req.body.name,
    _id: { $ne: id },
  });
  if (checkCouponName) {
    return next(new Error(`This coupon Name: ${req.body.name} Is Exist`, {cause:409}));
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-commerce/coupon/${req.body.name}` }
    );
    if(isExist.image.public_id){
      await cloudinary.uploader.destroy(isExist.image.public_id)
    }
    req.body.image = { secure_url, public_id };
  }
  await isExist .save()
  const coupon = await couponModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );
  return res.status(201).json({message:"Done", coupon})
});
export const deleteCoupon = deleteOneById(couponModel)

export const getAllCoupons = asyncHandler(async(req,res,next)=>{
  const allCoupons = await couponModel.find({})
  return res.status(200).json({message:"Done", allCoupons})
})
export const getCouponById = getOneById(couponModel)

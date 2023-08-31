import orderModel from "../../../DB/model/Order.model.js";
import productModel from "../../../DB/model/Product.model.js";
import reviewModel from "../../../DB/model/Review.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { getOneById } from "../../utils/code.handler.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addReview = asyncHandler(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const { createdBy } = req.user._id;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new ErrorClass("Not Found", 404));
  }
  const order = await orderModel.findOne({
    userId: createdBy,
    status: "Delivered",
    "products.productId": productId,
  });
  if (!order) {
    return next(new ErrorClass("You Can Not Rate This Order", 403));
  }

  const isReviewed = await reviewModel.findOne({ productId, createdBy });
  if (isReviewed) {
    return next(new ErrorClass("You Can Not Rate This Order Again", 403));
  }

  const review = await reviewModel.create({
    productId,
    rating,
    comment,
    createdBy,
  });

  let oldAvg = product.avgRate;
  let oldratesNums = product.ratesNums;
  let sum = oldAvg * oldratesNums + rating;

  product.avgRate = sum / (ratesNums + 1);
  product.ratesNums = oldratesNums + 1;
  product.save();

  return res.status(200).json({ message: "Dome", review });
});
export const updateReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const createdBy = req.user._id;
  const isReviewed = await reviewModel.findOne({ _id: reviewId, createdBy });
  if (!isReviewed) {
    return next(new ErrorClass("You Can Not Rate This Order", 403));
  }

  if (rating) {
    const product = await productModel.findById(isReviewed.productId);
    let oldAvg = product.avgRate;
    let oldratesNums = product.ratesNums;
    let sum = oldAvg * oldratesNums - product.rating + rating;

    product.avgRate = sum / oldratesNums;
    product.save();
    isReviewed.rating = rating;
  }
  if (comment) {
    isReviewed.comment = comment;
  }

  await isReviewed.save();
  return res.status(200).json({ message: "Dome", review: isReviewed });
});
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const createdBy = req.user._id;
  const isReviewed = await reviewModel.findOneAndDelete({ _id: reviewId, createdBy });
  if (!isReviewed) {
    return next(new ErrorClass("You Can Not Rate This Order", 403));
  }
  const product = await productModel.findById(isReviewed.productId);
  let sum = ((product.avgRate * product.ratesNums) - product.rating)

  product.avgRate = sum / product.ratesNums -1;
  product.ratesNums = product.ratesNums -1
  product.save();

  await isReviewed.save();
  return res.status(200).json({ message: "Dome", review: isReviewed });
});
export const getReviewById = getOneById(reviewModel)
export const getproductReviews = asyncHandler(async(req,res,next)=>{
    const{ productId} = req.query 
    const reviews = await reviewModel.find({productId})
    return res.status(200).json({message:'Done', reviews})
})

import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as couponValidators from "./coupon.validation.js";
import {auth} from '../../middleware/auth.js'
import {endpoint} from './coupon.endPoint.js'
const router = Router();



router
  .route("/")
  .get(auth(endpoint.get),couponController.getAllCoupons)
  .post(
    auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(couponValidators.addNewCoupon),
    couponController.addNewcoupon
  );


  router
  .route("/:id")
  .get(couponController.getCouponById)
  .put(
    auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(couponValidators.updateCoupon),
    couponController.updateCoupon
  ).delete(
    auth(endpoint.delete),
   validation(couponValidators.deleteCoupon),
   couponController.deleteCoupon
 );

export default router;



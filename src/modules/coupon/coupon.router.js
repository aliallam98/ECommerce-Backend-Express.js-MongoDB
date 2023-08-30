import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as couponValidators from "./coupon.validation.js";
import {auth, roles} from '../../middleware/auth.js'
const router = Router();



router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(auth([roles.user]),
    fileUpload(fileValidation.image).single("image"),
    validation(couponValidators.addNewCoupon),
    couponController.addNewcoupon
  );


  router
  .route("/:couponId").put(
    fileUpload(fileValidation.image).single("image"),
    validation(couponValidators.updateCoupon),
    couponController.updateCoupon
  ).delete(
   validation(couponValidators.deleteCoupon),
   couponController.deleteCoupon
 );

export default router;



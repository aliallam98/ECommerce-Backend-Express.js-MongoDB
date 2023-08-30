import { Router } from "express";
import * as productController from "./product.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as productValidation from "./product.validation.js";
import {auth , roles} from '../../middleware/auth.js'
const router = Router();

router.get("/", productController.getAllProducts);
router.get(
  "/:id",
  validation(productValidation.getProductById),
  productController.getProductById
);

router.post(
  "/",
  auth([roles.admin]),
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validation(productValidation.createNewProduct),
  productController.createNewProduct
);

router.put(
  "/:productId",
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),validation(productValidation.updateProduct),
  productController.updateProduct
);

router.delete(
  "/:id",
  validation(productValidation.deleteProduct),
  productController.deleteProduct
);

// Add To WishList
router.patch('/wishlist/add/:productId', auth([roles.user]),productController.addToWishList) //Add
router.patch('/wishlist/remove/:productId', auth([roles.user]),productController.removeFromWishList) //Remove
router.patch('/wishlist/clear', auth([roles.user]),productController.clearAllWishList) //Clear
export default router;

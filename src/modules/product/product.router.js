import { Router } from "express";
import * as productController from "./product.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as productValidation from "./product.validation.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./product.endPoint.js";
import reviewRouter from "../reviews/reviews.router.js";
const router = Router({ mergeParams: true });

router.use("/:id/reviews", reviewRouter);

router.get("/", productController.getAllProducts);
router.get(
  "/:id",
  validation(productValidation.getProductById),
  productController.getProductById
);
router.get(
  "/related-products/:id",
  validation(productValidation.getProductById),
  productController.getRelatedProducts
);

router.post(
  "/",
  auth(endpoint.create),
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validation(productValidation.create),
  productController.createNewProduct
);

router.put(
  "/:id",
  auth(endpoint.updateProduct),
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validation(productValidation.updateProduct),
  productController.updateProduct
);

router.delete(
  "/:id",
  auth(endpoint.deleteProduct),
  validation(productValidation.deleteProduct),
  productController.deleteProduct
);

// Start WishList
router.patch(
  "/wishlist/add/:productId",
  auth(endpoint.add),
  productController.addToWishList
); //Add
router.patch(
  "/wishlist/remove/:productId",
  auth(endpoint.remove),
  productController.removeFromWishList
); //Remove
router.patch(
  "/wishlist/clear",
  auth(endpoint.clear),
  productController.clearAllWishList
); //Clear
// End WishList

export default router;

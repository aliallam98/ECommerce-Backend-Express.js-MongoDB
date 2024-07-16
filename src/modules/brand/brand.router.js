import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandValidators from "./brand.validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import productRouter from "../product/product.router.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./brand.endPoint.js";
const router = Router();

router.use("/:id/product", productRouter);

router
  .route("/")
  .get(brandController.getAllBrands)
  .post(
    auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(brandValidators.create),
    brandController.createBrand
  );

router.route("/all").get(brandController.allBrands);

router
  .route("/get-by-name/:name")
  .get(brandController.getBrandByNameWithProducts);

router
  .route("/:id")
  .put(
    auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(brandValidators.update),
    brandController.updateBrand
  )
  .delete(
    auth(endpoint.delete),
    validation(brandValidators.deleteBrand),
    brandController.deleteBrand
  )
  .get(validation(brandValidators.getBrandById), brandController.getBrandById);

export default router;

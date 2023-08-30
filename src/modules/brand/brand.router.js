import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandValidtors from "./brand.validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";

const router = Router();

router
  .route("/")
  .get(brandController.getAllBrands)
  .post(
    fileUpload(fileValidation.image).single("image"),
    validation(brandValidtors.createNewBrand),
    brandController.createNewBrand
  );
router
  .route("/:id")
  .put(
    fileUpload(fileValidation.image).single("image"),
    validation(brandValidtors.updateBrand),
    brandController.updateBrand
  )
  .delete(validation(brandValidtors.deleteBrand), brandController.deleteBrand)
  .get(validation(brandValidtors.getBrandById),brandController.getBrandById)

export default router;

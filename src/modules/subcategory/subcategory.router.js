import { Router } from "express";
import * as subCategoryController from "./subcategory.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as subCategoryValidators from "./subcategory.validation.js";
const router = Router({ mergeParams: true });
import productRouter from '../product/product.router.js'



router.use("/:id/product", productRouter);
router
  .route("/")
  .get(subCategoryController.getAllSubCategoies)
  .post(
    fileUpload(fileValidation.image).single("image"),
    validation(subCategoryValidators.addNewSubCategory),
    subCategoryController.addNewSubCategory
  );

//
// router.post('/',fileUpload(fileValidation.image).single('image'),subCategoryController.addNewSubCategory)
//
router
  .route("/:id")
  .put(
    fileUpload(fileValidation.image).single("image"),
    validation(subCategoryValidators.updateSubCategory),
    subCategoryController.updateSubCategory
  )
  .get(
    validation(subCategoryValidators.getSubCategoryById),
    subCategoryController.getSubCategoryById
  )
  .delete(
    validation(subCategoryValidators.deleteSubCategory),
    subCategoryController.deleteSubCategory
  );

// router.get(
//   "/searchbyname",
//   validation(subCategoryValidators.searchSubCategory),
//   subCategoryController.searchSubCategory
// );

export default router;

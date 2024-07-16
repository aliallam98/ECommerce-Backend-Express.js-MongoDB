import { Router } from "express";
import * as subCategoryController from "./subcategory.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as subCategoryValidators from "./subcategory.validation.js";
const router = Router({ mergeParams: true });
import productRouter from '../product/product.router.js'
import {auth} from '../../middleware/auth.js'
import { endpoint } from "./subcategory.endPoint.js";



router.use("/:id/product", productRouter);
router
  .route("/")
  .get(subCategoryController.AllSubCategories)
  .post(auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(subCategoryValidators.create),
    subCategoryController.addNewSubCategory
  );

//
// router.post('/',fileUpload(fileValidation.image).single('image'),subCategoryController.addNewSubCategory)
//
router
  .route("/:id")
  .put(auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(subCategoryValidators.update),
    subCategoryController.updateSubCategory
  )
  .get(
    validation(subCategoryValidators.getSubCategoryById),
    subCategoryController.getSubCategoryById
  )
  .delete(auth(endpoint.delete),
    validation(subCategoryValidators.deleteSubCategory),
    subCategoryController.deleteSubCategory
  );

// router.get(
//   "/searchbyname",
//   validation(subCategoryValidators.searchSubCategory),
//   subCategoryController.searchSubCategory
// );

export default router;

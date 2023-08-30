import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as categoryValidators from "./category.validation.js";
import subCategoryRouter from "../subcategory/subcategory.router.js";
import {auth, roles} from "../../middleware/auth.js";
const router = Router();

router.use("/:id/subcategory", subCategoryRouter);

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    auth([roles.admin]),
    fileUpload(fileValidation.image).single("image"),
    validation(categoryValidators.addNewCategoryVal),
    categoryController.addNewCategory
  );


  router
  .route("/:id")
  .put(
    fileUpload(fileValidation.image).single("image"),
    validation(categoryValidators.updateCategoryVal),
    categoryController.updateCategory
  ).delete(
    validation(categoryValidators.deleteCategoryVal),
    categoryController.deleteCategory
  ).get(
    validation(categoryValidators.searchCategoryVal),
    categoryController.getCategoryById
  );


export default router;

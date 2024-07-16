import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as categoryValidators from "./category.validation.js";
import subCategoryRouter from "../subcategory/subcategory.router.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./category.endPoint.js";
const router = Router();

router.use("/:id/subcategory", subCategoryRouter);

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(categoryValidators.create),
    categoryController.createNewCategory
  );
  
  //


//Done

router.route("/all").get(categoryController.allCategories)
router.route("/get-by-name/:name").get(categoryController.getCategoryByNameWithProducts)




router
  .route("/:id")
  .put(
    auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(categoryValidators.update),
    categoryController.updateCategory
  )
  .delete(
    auth(endpoint.delete),
    validation(categoryValidators.deleteCategoryVal),
    categoryController.deleteCategory
  )
  .get(
    validation(categoryValidators.getById),
    categoryController.getCategoryById
  );

export default router;

import { Router } from "express";
import * as userController from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./user.endPoint.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router();

router.get("/wish-list", auth(endpoint.getCart), userController.getWishList);
router.get("/profile", auth(endpoint.getCart), userController.getPersonalInfo);
router.put(
  "/update",
  auth(endpoint.getCart),
  fileUpload(fileValidation.image).single("profileImage"),
  userController.updatePersonalInfo
);

export default router;

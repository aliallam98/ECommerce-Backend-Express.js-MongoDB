import { Router } from "express";
const router = Router();
import * as reviewsController from "./reviews.controller.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./reviews.endPoint.js";
import { validation } from "../../middleware/validation.js";
import * as reviewsValiditors from "./reviews.validation.js";

router.get(
  "/:productId",
  validation(reviewsValiditors.getproductReviews),
  reviewsController.getproductReviews
);
router.post(
  "/",
  auth(endpoint.add),
  validation(reviewsValiditors.addReview),
  reviewsController.addReview
);
router.put(
  "/:reviewId",
  auth(endpoint.update),
  validation(reviewsValiditors.updateReview),
  reviewsController.updateReview
);
router.delete(
  "/:reviewId",
  auth(endpoint.delete),
  validation(reviewsValiditors.deleteReview),
  reviewsController.deleteReview
);
router.get(
  "/:id",
  validation(reviewsValiditors.getReviewById),
  reviewsController.getReviewById
);

export default router;

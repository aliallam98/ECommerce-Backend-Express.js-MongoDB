import { Router } from "express";
import express from "express";
const router = Router();
import * as orderController from "./order.controller.js";
import { auth, AvailableRoles } from "../../middleware/auth.js";

router.post(
  "/",
  auth([AvailableRoles.superAdmin]),
  orderController.createOrder
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  orderController.stripeWebHook
);
router.patch(
  "/:orderId",
  auth([AvailableRoles.user]),
  orderController.caneclOrder
);

export default router;

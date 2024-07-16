import cookieParser from "cookie-parser"; 
import connectToDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import branRouter from "./modules/brand/brand.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import categoryRouter from "./modules/category/category.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import orderRouter from "./modules/order/order.router.js";
import productRouter from "./modules/product/product.router.js";
import reviewsRouter from "./modules/reviews/reviews.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import userRouter from "./modules/user/user.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  //convert Buffer Data
  // app.use((req, res, next) => {
  //   if (req.originalUrl == "/order/webhook") {
  //     console.log("webhook");
  //     next();
  //   } else {
  //     express.json({})(req, res, next);
  //   }
  // });
  app.use(express.json())
  app.use(cookieParser());
  //Setup API Routing
  app.use(`/api/auth`, authRouter);
  app.use(`/api/user`, userRouter);
  app.use(`/api/product`, productRouter);
  app.use(`/api/category`, categoryRouter);
  app.use(`/api/sub-category`, subcategoryRouter);
  app.use(`/api/reviews`, reviewsRouter);
  app.use(`/api/coupon`, couponRouter);
  app.use(`/api/cart`, cartRouter);
  app.use(`/api/order`, orderRouter);
  app.use(`/api/brand`, branRouter);

  app.all("*", (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method");
  });
  app.use(globalErrorHandling);

  connectToDB();
};

export default initApp;

import userModel from "../../DB/model/User.model.js";
import { ErrorClass } from "../utils/ErrorClass.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";


export const AvailableRoles = {
  superAdmin: "Super-Admin",
  admin: "Admin",
  user: "User",
};

export const auth = (roles = [], permissions = "") => {
  return async (req, res, next) => {
    try {
      let { ecommercejwt:token } = req.cookies
      console.log("token",token);

      if (!token?.startsWith(process.env.BEARER_KEY)) {
        return next(new ErrorClass("Authorization Is Required", 401));
      }


       token = token.split(process.env.BEARER_KEY)[1];

      if (!token) {
        return next(new ErrorClass("token Is Required", 401));
      }

      const decoded = verifyToken({ token });
      if (!decoded?.id) {
        return next(new ErrorClass("Invaild Payload Data", 401));
      }

      const user = await userModel.findById(decoded.id);
      if (!user) {
        return next(new ErrorClass("Not Registered Account", 404));
      }

      if (
        roles.length > 0 &&
        !roles.includes(user.role) ||
        permissions.length > 0 &&
        !user.permissions.includes(permissions)
      ) {
        return next(new ErrorClass("You are Unauthorized", 401));
      }
      req.user = user;
      next();
    } catch (error) {
      return res.json({ message: "Catch error", err: error?.message });
    }
  };
};

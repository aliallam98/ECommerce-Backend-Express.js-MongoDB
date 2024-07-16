import { ErrorClass } from "./ErrorClass.js";
import cloudinary from "./cloudinary.js";
import { asyncHandler } from "./errorHandling.js";

export const deleteOneById = (model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const isExist = await model.findByIdAndDelete(id);
    if (!isExist) {
      return next(new ErrorClass("This Document Is Not Exist", 404));
    }
    if (isExist.image.public_id) {
      await cloudinary.uploader.destroy(isExist.image.public_id);
    }

    return res.status(200).json({ message: "Deleted Successfully" });
  });
};

export const getOneById = (model, type) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const searchResult =
      type === "product"
        ? await model.findById(id).populate([
            { path: "categoryId", select: ["name"] },
            { path: "brandId", select: ["name"] },
          ])
        : await model.findById(id);
    if (!searchResult) {
      return next(new ErrorClass("This Document is Not Exist", 404));
    }
    return res
      .status(200)
      .json({ success: true, message: "", results: searchResult });
  });
};

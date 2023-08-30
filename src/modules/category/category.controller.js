import slugify from "slugify";
import { asyncHandler } from "../../utils/errorHandling.js";
import categoryModel from "../../../DB/model/Category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { ApiFeatures } from "../../utils/api.features.js";
import { deleteOneById , getOneById} from "../../utils/code.handler.js";

export const addNewCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name);
  const { path } = req.file;
  console.log(name, slug, path);

  const isExist = await categoryModel.findOne({ name });
  if (isExist) {
    return next(new ErrorClass("This Category is Exist", 409));
  }
  console.log(req.file);
  const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
    folder: `E-commerce/Category/${name}`,
  });
  const category = await categoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy : req.user._id
  });
  return res.status(201).json({ message: "Done", category });
});
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.name = req.body.name;
  req.body.slug = slugify(req.body.name);

  const isExist = await categoryModel.findById(id);
  if (!isExist) {
    return next(new ErrorClass("This Category is Not Exist", 404));
  }
  const checkCategoryName = await categoryModel.findOne({
    name: req.body.name,
    _id: { $ne: id },
  });
  console.log(checkCategoryName);
  if (checkCategoryName) {
    return next(
      new ErrorClass(`This Category Name: ${req.body.name} Is Exist`, 409)
    );
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-commerce/Category/${req.body.name}` }
    );
    await cloudinary.uploader.destroy(isExist.image.public_id);
    req.body.image = { secure_url, public_id };
  }
  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name: req.body.name, slug: req.body.slug, image: req.body.image },
    { new: true }
  );
  return res.status(201).json({ message: "Done", category });
});
export const deleteCategory = deleteOneById(categoryModel);

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(categoryModel.find().populate([
    {
      path: "SubCategories",
    },
  ]), req.query)
    .pagination(categoryModel)
    .sort()
    .filter()
    .search()
    .select()

  const allCategories = await apiFeatures.mongooseQuery;

  return res.status(200).json({ message: "Done", allCategories });
});
export const getCategoryById = getOneById(categoryModel)
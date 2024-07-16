import slugify from "slugify";
import { asyncHandler } from "../../utils/errorHandling.js";
import categoryModel from "../../../DB/model/Category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { ApiFeatures } from "../../utils/api.features.js";
import { deleteOneById, getOneById } from "../../utils/code.handler.js";
import productModel from "../../../DB/model/Product.model.js";

export const allCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find({}).populate({
    path: "createdBy",
    select: "fullName",
  });

  return res.status(200).json({
    success: true,
    message: "Done",
    results: categories,
  });
});

//With Pagination
export const getAllCategories = asyncHandler(async (req, res, next) => {
  const { results, metaData } = await ApiFeatures(categoryModel, req.query);

  return res.status(200).json({
    success: true,
    message: "Done",
    results: {
      categories: results,
      metaData,
    },
  });
});

export const getCategoryById = getOneById(categoryModel);
export const getCategoryByNameWithProducts = asyncHandler(async (req, res, next) => {
  const categoryName = req.params.name;

  const isCategoryExist = await categoryModel.findOne({ name: categoryName });
  if (!isCategoryExist) {
    return next(new ErrorClass("Cannot find Category"));
  }

  const { results, metaData } = await ApiFeatures(productModel, req.query, {
    categoryId: isCategoryExist._id,
  });

  // console.log({ results, metaData });

  return res.status(200).json({
    success: true,
    message: "Done",
    results: {
      products: results,
      metaData,
    },
  });
});

export const createNewCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name);
  const { path } = req.file;

  const isNameExist = await categoryModel.findOne({ name });
  if (isNameExist) {
    return next(new ErrorClass(`This Category Name: "${name}" is Exist`, 409));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
    folder: `E-commerce/Category/${name}`,
  });

  const newCategory = await categoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: `category: ${newCategory.name} created`,
    results: newCategory,
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.name = req.body.name;
    req.body.slug = slugify(req.body.name);
  }

  const isCategoryExist = await categoryModel.findById(id);
  if (!isCategoryExist) {
    return next(new ErrorClass("This Category is Not Exist", 404));
  }
  const checkCategoryName = await categoryModel.findOne({
    name: req.body.name,
    _id: { $ne: id },
  });
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
    await cloudinary.uploader.destroy(isCategoryExist.image.public_id);
    req.body.image = { secure_url, public_id };
  }
  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name: req.body.name, slug: req.body.slug, image: req.body.image },
    { new: true }
  );
  return res
    .status(201)
    .json({ message: `category: "${category.name}" updated`, category });
});

export const deleteCategory = deleteOneById(categoryModel);

import slugify from "slugify";
import { asyncHandler } from "../../utils/errorHandling.js";
import brandModel from "../../../DB/model/Brand.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { deleteOneById, getOneById } from "../../utils/code.handler.js";
import { ApiFeatures } from "../../utils/api.features.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import productModel from "../../../DB/model/Product.model.js";

export const allBrands = asyncHandler(async (req, res, next) => {
  const brands = await brandModel.find({}).populate({
    path: "createdBy",
    select: "fullName",
  });
  return res
    .status(200)
    .json({ success: true, message: "Done", results: brands });
});
export const getAllBrands = asyncHandler(async (req, res, next) => {
  const { results, metaData } = await ApiFeatures(brandModel, req.query);

  return res.status(200).json({
    success: true,
    message: "Done",
    results: {
      brands: results,
      metaData,
    },
  });
});
export const getBrandByNameWithProducts = asyncHandler(
  async (req, res, next) => {
    const brandName = req.params.name;

    const isBrandExist = await brandModel.findOne({ name: brandName });
    if (!isBrandExist) {
      return next(new ErrorClass("Cannot find brand"));
    }

    const { results, metaData } = await ApiFeatures(productModel, req.query, {
      brandId: isBrandExist._id,
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
  }
);

export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name);
  const { path } = req.file;

  const checkBrandName = await brandModel.findOne({ name });
  if (checkBrandName) {
    return next(new ErrorClass(`Cannot Add This name:${name} its Exist `, 409));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
    folder: `E-commerce/Brand/${name}`,
  });

  const brand = await brandModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy: req.user._id,
  });
  return res
    .status(201)
    .json({
      success: true,
      message: `Brand: ${brand.name} created`,
      results: brand,
    });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  const checkBrandExisting = await brandModel.findById(id);
  if (!checkBrandExisting) {
    return next(new ErrorClass(`Cannot Find This Brand its Not Exist `, 404));
  }

  const checkBrandName = await brandModel.findOne({
    name: req.body.name,
    _id: { $ne: id },
  });

  if (checkBrandName) {
    next(
      new ErrorClass(`Cannot Add This name:${req.body.name} its Exist `, 409)
    );
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-commerce/Brand/${req.body.name}`,
      }
    );
    await cloudinary.uploader.destroy(checkBrandExisting.image.public_id);
    req.body.image = { secure_url, public_id };
  }

  const brandToUpdate = await brandModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res
    .status(201)
    .json({
      success: true,
      message: `Brand: ${brandToUpdate.name} Updated`,
      results: brandToUpdate,
    });
});

export const deleteBrand = deleteOneById(brandModel);
export const getBrandById = getOneById(brandModel);

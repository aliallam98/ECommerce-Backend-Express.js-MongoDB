import slugify from "slugify";
import { asyncHandler } from "../../utils/errorHandling.js";
import productModelModel from "../../../DB/model/Product.model.js";
import cloudinary from "../../utils/cloudinary.js";
import productModel from "../../../DB/model/Product.model.js";
import categoryModel from "../../../DB/model/Category.model.js";
import SubCategoryModel from "../../../DB/model/SubCategory.model.js";
import brandModel from "../../../DB/model/Brand.model.js";
import subCategoryModel from "../../../DB/model/SubCategory.model.js";
import { ApiFeatures } from "../../utils/api.features.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { getOneById } from "../../utils/code.handler.js";
import userModel from "../../../DB/model/User.model.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productModel.find(),req.query).pagination(productModel).sort().filter().search().select()
  const products = await apiFeatures.mongooseQuery
  const data = {
    totalDocuments : apiFeatures.queryData.totalDocuments,
    totalPages : apiFeatures.queryData.totalPages,
    nextPage : apiFeatures.queryData.next,
    prevPage:   apiFeatures.queryData.previous,
    currentPage: apiFeatures.queryData.currentPage,
    resultsPerPage : products.length
  }


  return res.status(200).json({ message: "Done", data  , products  });
});
export const createNewProduct = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  req.body.name = req.body.name;
  console.log(req.body.name);
  req.body.slug = slugify(req.body.name);
  req.body.discount = (req.body.discount * req.body.price) / 100;
  req.body.paymentPrice = req.body.price - req.body.discount;

  const checkNameExisting = await productModel.findOne({ name: req.body.name });
  if (checkNameExisting) {
    checkNameExisting.stock += parseInt(req.body.stock);
    await checkNameExisting.save();
    return res.status(200).json({
      message: "This Product was Exist Before and Stock Updated Now",
      checkNameExisting,
    });
  }
  const checkCategory = await categoryModel.findById(req.body.categoryId);
  if (!checkCategory) {
    return next(new ErrorClass("Invaid category Id ", 404));
  }
  const checkSubCategory = await subCategoryModel.findById(
    req.body.subCategoryId
  );
  if (!checkSubCategory) {
    return next(new ErrorClass("Invaid SubCategory Id ", 404));
  }
  const checkBrand = await brandModel.findById(req.body.brandId);
  if (!checkBrand) {
    return next(new ErrorClass("Invaid Brand Id ", 404));
  }
  if (req.files) {
    if(req.files.image){
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        { folder: `E-commerce/Product/${req.body.name}/MainImage` }
      );
      req.body.image = { secure_url, public_id };
    }
    if(req.files.images){
      const images = [];
    for (let i = 0; i < req.files.images.length; i++) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.images[i].path,
        { folder: `E-commerce/Product/${req.body.name}/SliderImages` }
      );
      images.push({ secure_url, public_id });
      req.body.images = images;
    }
    }
  }
  req.body.createdBy = req.user._id

  const product = await productModel.create(req.body);
  return res.status(201).json({ message: "Created", product });
});
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const checkProductExisting = await productModel.findById(id);
  if (!checkProductExisting) {
    return next(new ErrorClass("Product Not Found", 404));
  }
  const checkProductName = await productModel.findOne({
    name: req.body.name,
    _id: { $ne: id },
  });
  if (checkProductName) {
    return next(
      new ErrorClass(`Thiss Name:{req.body.name} is Exist Before`, 409)
    );
  }
  req.body.name = req.body.name;
  req.body.slug = slugify(req.body.name);
  req.body.discount = (req.body.discount * req.body.price) / 100;
  req.body.paymentPrice = req.body.price - req.body.discount;

  const checkCategory = await categoryModel.findById(req.body.categoryId);
  if (!checkCategory) {
    return next(new ErrorClass("Invaid category Id ", 400));
  }
  const checkSubCategory = await subCategoryModel.findById(
    req.body.subCategoryId
  );
  if (!checkSubCategory) {
    return next(new ErrorClass("Invaid SubCategory Id ", 400));
  }
  const checkBrand = await brandModel.findById(req.body.brandId);
  if (!checkBrand) {
    return next(new ErrorClass("Invaid Brand Id ", 400));
  }
  console.log(req.files);
  if (req.files) {
    if (req.files.image) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        { folder: `E-commerce/Product/${req.body.name}/MainImage` }
      );
      await cloudinary.uploader.destroy(checkProductExisting.image.public_id);
      req.body.image = { secure_url, public_id };
    }
    if (req.files.images) {
      const images = [];
      for (let i = 0; i < req.files.images.length; i++) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.files.images[i].path,
          { folder: `E-commerce/Product/${req.body.name}/SliderImages` }
        );
        images.push({ secure_url, public_id });
        req.body.images = images;
      }
      for (let i = 0; i < checkProductExisting.images.length; i++) {
        await cloudinary.uploader.destroy(
          checkProductExisting.images[i].public_id
        );
      }
    }
  }
  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(201).json({ message: "Updated", product });
});
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isExist = await productModel.findByIdAndDelete(id);
  if (!isExist) {
    return next(new ErrorClass("This Document Is Not Exist", 404));
  }
  if (isExist.image.public_id) {
    await cloudinary.uploader.destroy(isExist.image.public_id);
  }
  if (isExist.images) {
    for (let i = 0; i < isExist.images.length; i++) {
      await cloudinary.uploader.destroy(isExist.images[i].public_id);
    }
  }
  return res.status(200).json({ message: "Deleted Successfully" });
});
export const getProductById = getOneById(productModel);


// Add To WishList

//Add
export const addToWishList = asyncHandler(async(req,res,next)=>{
  const {productId} = req.params
  const product = await productModel.findById(productId)
  if(!product){
    return next(new ErrorClass('No Product Found',404))
  }
  if(req.user.wishList.includes(productId)){
    return next(new ErrorClass("Added before", 400))
  }
   await userModel.findOneAndUpdate({_id:req.user._id},{
    $addToSet:{
      wishList:productId
    }
   })
   return res.status(200).json({message:"Done"})
})
//Remove
export const removeFromWishList = asyncHandler(async(req,res,next)=>{
  const {productId} = req.params
  if(!req.user.wishList.includes(productId)){
    return next(new ErrorClass('No Product Found',404))
  }
   await userModel.findOneAndUpdate({_id:req.user._id},{
    $pull:{
      wishList:productId
    }
   })
   return res.status(200).json({message:"Done"})
})
//Clear
export const clearAllWishList = asyncHandler(async(req,res,next)=>{
  if(!req.user.wishList.length){
    return next( new ErrorClass("Cart Is Empty",200))
  }
   await userModel.findOneAndUpdate({_id:req.user._id},{
    wishList:[]
   })
   return res.status(200).json({message:"Done"})
})

import { asyncHandler } from "../../utils/errorHandling.js";
import productModel from "../../../DB/model/Product.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import cartModel from "../../../DB/model/Cart.model.js";
import { getOneById } from "../../utils/code.handler.js";

//
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new ErrorClass("This Product Is Not Found ", 404));
  }
  if (quantity > product.stock) {
    await productModel.findByIdAndUpdate(productId, {
      $addToSet: { wishList: req.user._id },
    });
    return next(
      new ErrorClass("Out Of Stock this item quantity not enough", 400)
    );
  }

  const cart = await cartModel.findOne({ userId: req.user._id });
  const productIndex = cart.products.findIndex(
    (ele) => ele.productId.toString() == productId
  );
  if (productIndex == -1) {
    cart.products.push({
      productId: productId,
      quantity,
    });
  } else {
    cart.products[productIndex].quantity = quantity;
  }

  cart.save();
  return res
    .status(200)
    .json({ success: true, message: "Done", results: cart });
});

export const deleteFromCart = asyncHandler(async (req, res, next) => {
  // const product = cart.products.find((ele)=> ele.productId == req.params.id)

  const product = await cartModel.findOne({
    userId: req.user._id,
    "products.productId": req.params.id,
  });
  if (!product) {
    return next(new ErrorClass("This Product Is Not Found ", 404));
  }
  
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: req.params.id,
        },
      },
    }
  );

  res.json({ cart, Products: cart.products });
});

//
export const clearAllCart = asyncHandler(async (req, res, next) => {
  if (!req.user._id) return;

  await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
    },
    { new: true }
  );

  return res
    .status(200)
    .json({ success: true, message: "Cart is empty now ", results: [] });
});

//
export const getCartById = getOneById(cartModel);

//
export const getUserCart = asyncHandler(async (req, res, next) => {
  // console.log("aaaa","aaaaaaaaaa");

  const cart = await cartModel
    .findOne({ userId: req.user._id })
    .populate([
      { path: "products.productId", select: "name images paymentPrice" },
    ]);

  // console.log("cart",cart);
  if (!cart.products.length) {
    return res
      .status(200)
      .json({ success: true, message: "Done", results: [] });
  }

  let totalPrice = 0;
  cart.products = cart.products.filter((ele) => {
    if (ele?.productId) {
      totalPrice += ele.productId.paymentPrice * ele.quantity;
      return ele;
    }
  });
  cart.save();
  return res
    .status(200)
    .json({ success: true, message: "Done", results: { cart, totalPrice } });
});

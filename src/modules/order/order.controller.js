import { asyncHandler } from "../../utils/errorHandling.js";
import productModel from "../../../DB/model/Product.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import cartModel from "../../../DB/model/Cart.model.js";
import orderModel from "../../../DB/model/Order.model.js";
import couponModel from "../../../DB/model/Coupon.model.js";
import Stripe from "stripe";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from "../../utils/email.js";
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = async (req, res, next) => {
  let { products, phone, address, addressType, coupon, paymentMethod, note } =
    req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });

  console.log(req.body);

  //If there are not products in body will use cart
  if (!req.body.products) {
    products = cart.products;
    if (!cart.products.length) {
      return next(new ErrorClass("Cart Is Empty", 404));
    }
  }

  //lkk
  // Check Coupon
  if (coupon) {
    const isCouponExist = await couponModel.findOne({ name: coupon });
    req.body.coupon = isCouponExist;
    if (!isCouponExist) {
      return next(new ErrorClass("COUPON_NOT_FOUND", 404));
    }
    if (
      isCouponExist.expireDate.getTime() < Date.now() ||
      isCouponExist.maxUsingCounts <= isCouponExist.usedBy.length
    ) {
      return next(new ErrorClass("Coupon Is Expired", 400));
    }
    if (isCouponExist.usedBy.includes(req.user._id)) {
      return next(new ErrorClass("You Already Used This Coupon Before", 400));
    }
  }

  const existingProducts = [],
    productsIds = [];
  let price = 0;
  // Check Products
  for (const product of products) {
    const existingProduct = await productModel.findOne({
      _id: product.productId,
    });
    if (!existingProduct) {
      return next(new ErrorClass("PRODUCT_ID_IS_INVALID", 400));
    }
    if (existingProduct.stock < product.quantity) {
      return next(new ErrorClass("Stock Is Not Enough", 400));
    }
    console.log(existingProduct);
    existingProducts.push({
      productId: existingProduct._id,
      name: existingProduct.name,
      image: existingProduct.image.secure_url,
      stock: existingProduct.stock,
      price: existingProduct.price,
      paymentPrice: existingProduct.paymentPrice,
      quantity: product.quantity,
    });
    productsIds.push(existingProduct._id);
    price += existingProduct.paymentPrice * product.quantity || 1;
  }

  console.log("Error here");
  console.log(price);

  // Create Order
  const order = await orderModel.create({
    userId: req.user._id,
    products: existingProducts,
    phone,
    address,
    paymentMethod,
    status: paymentMethod == "Card" ? "WaitPayment" : "Placed",
    totalPrice: Number(price),
    finalPrice: Number(
      price - (price * req.body.coupon?.discountAmount || 0) / 100
    ),
    couponId: req.body.coupon?._id,
    note,
    addressType,
  });
  //Create Inovice and Send it
  const invoice = {
    shipping: {
      name: `${req.user.firstName} ${req.user.lastName}`,
      address: order.address,
    },
    items: existingProducts,
    subtotal: order.finalPrice,
    paid: 0,
    invoice_nr: order._id,
    date: order.createdAt,
  };
  await createInvoice(invoice, "invoice.pdf");
  // await sendEmail({to:req.user.email, subject:'Order Invoice',text:"Click the following file to see your invoice",attachments:[{
  //   path:'invoice.pdf',
  //   contentType:"application/pdf"
  // }]})

  // In Case paymentMethod Is Card
  if (order.paymentMethod == "Card") {
    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.discountAmount,
        duration: "once",
      });
      req.body.stripeCoupon = coupon.id;
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      success_url: process.env.success_url,
      cancel_url: process.env.cancel_url,
      metadata: {
        orderId: order._id.toString(),
      },
      discounts: [
        {
          coupon: req.body.stripeCoupon,
        },
      ],

      line_items: existingProducts.map((ele) => {
        return {
          price_data: {
            currency: "EGP",
            product_data: {
              name: ele.name,
              images: [ele.image],
            },
            unit_amount: ele.paymentPrice * 100,
          },
          quantity: ele.quantity || 1,
        };
      }),
    });
    return res.json(session.url);
  }

  //Mark User That Used Coupon
  if (coupon) {
    await couponModel.findByIdAndUpdate(req.body.coupon._id, {
      $addToSet: {
        usedBy: req.user._id,
      },
    });
  }
  //Delete Selected Items From the Cart If Existed And In Case Used Cart's Products Will Make It Empty
  if (req.body.products) {
    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      {
        $pull: {
          products: {
            productId: { $in: productsIds },
          },
        },
      }
    );
  } else {
    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { products: [] }
    );
  }
  //Decreament Stock And Increament SoldItems
  for (const product of existingProducts) {
    await productModel.findOneAndUpdate(
      { _id: product.productId },
      { $inc: { stock: -product.quantity, soldItems: product.quantity } }
    );
  }

  res.json(order);
};

export const stripeWebHook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    //         case 'checkout.session.async_payment_failed':
    //   const checkoutSessionAsyncPaymentFailed = event.data.object;
    //   // Then define and call a function to handle the event checkout.session.async_payment_failed
    //   break;
    case "checkout.session.completed":
      const { orderId } = event.data.object.metadata;
      const order = await orderModel.findOneAndUpdate(
        { _id: orderId },
        { status: "Placed" }
      );
      const products = order.products;
      for (const product of products) {
        await productModel.findOneAndUpdate(
          { _id: product.productId },
          {
            $inc: {
              stock: -Number(product.quantity),
              soldItems: Number(product.quantity),
            },
          }
        );
      }

      break;
    // ... handle other event types
    default:
      await orderModel.findOneAndUpdate(
        { _id: orderId },
        { status: "Rejected" }
      );
  }
});

export const caneclOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  //chech Order Existing
  const order = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
  });
  if (!order) {
    return next(new ErrorClass("Cannot Find This Order", 404));
  }
  //chech Order Satus
  if (
    (order?.status != "Placed" && order.paymentMethod == "Cash") ||
    ((order?.status != "WaitPayment" || order?.status != "Placed") &&
      order.paymentMethod == "Card")
  ) {
    return next(
      new ErrorClass(
        `Cannot Cancel This Order After Status Changed to ${order.status}`,
        403
      )
    );
  }
  //Cancel Order

  const cancelOrder = await orderModel.findOneAndUpdate(
    { _id: orderId },
    { status: "Canceled", reason }
  );
  if (!cancelOrder) {
    return next(
      new ErrorClass("SomeThing Went Wrong And Order Not Canceled", 400)
    );
  }

  if (order.paymentMethod == "Card") {
    const session = await stripe.refunds.session.create;
  }
  //increament Prodcuts Stock
  for (const product of order.products) {
    await productModel.findByIdAndUpdate(
      { _id: product.productId },
      { $inc: { stock: product.quantity, soldItems: -product.quantity } }
    );
  }
  //Remove User From Coupon UsedBy
  if (order.couponId) {
    await couponModel.findOneAndUpdate(
      { _id: order.couponId },
      {
        $pull: {
          usedBy: req.user._id,
        },
      }
    );
  }

  return res.status(200).json({ message: "Done", cancelOrder });
});

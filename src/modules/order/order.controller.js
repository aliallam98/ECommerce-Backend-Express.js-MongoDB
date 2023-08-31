import { asyncHandler } from "../../utils/errorHandling.js";
import productModel from "../../../DB/model/Product.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import cartModel from "../../../DB/model/Cart.model.js";
import orderModel from "../../../DB/model/Order.model.js";
import couponModel from "../../../DB/model/Coupon.model.js";
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_KEY)

export const createOrder = async(req,res,next)=>{
    let {products,phone,adresse,coupon,paymentMethod,note,reason} = req.body
    const cart = await cartModel.findOne({userid:req.user._id})

    //If there are not products in body will use cart
    if(!req.body.products){
        products = cart.products
        if(!cart.products.length){
            return next(new ErrorClass('Cart Is Empty', 404))
        }
    }

    //lkk
        // Check Coupon
        if(coupon){
            const iscouponExist =await couponModel.findOne({name:coupon})
            req.body.coupon = iscouponExist
            if(!iscouponExist){
                return next(new ErrorClass("COUPON_NOT_FOUND",404))
            }
            if(iscouponExist.expireDate.getTime() < Date.now() || iscouponExist.maxUsingCounts <= iscouponExist.usedBy.length ){
                return next(new ErrorClass("Coupon Is Expired",400))
            }
            if(iscouponExist.usedBy.includes(req.user._id)){
                return next(new ErrorClass("You Already Used This Coupon Before",400))
            }
        }
        const existingProducts=[],productsIds=[]
        let price = 0
        // Check Products
        for (const product of products){
            const existingProduct = await productModel.findOne({_id:product.productId})
            if(!existingProduct){
                return next(new ErrorClass('PRODUCT_ID_IS_INVALID',400))
            }
            if(existingProduct.stock < product.quantity){
                return next(new ErrorClass('Stock Is Not Enough',400))
            }
            existingProducts.push({
                productId:existingProduct._id,
                name:existingProduct.name,
                image:existingProduct.image.secure_url,
                stock:existingProduct.stock,
                price:existingProduct.price,
                paymentPrice:existingProduct.paymentPrice,
                quantity:product.quantity
            })
            productsIds.push(existingProduct._id)
            price += (existingProduct.paymentPrice * product.quantity)
        }

        // Create Order
        const order = await orderModel.create({
            userId:req.user._id,
            products:existingProducts,
              phone,
              adresse,
              paymentMethod,
              status: paymentMethod == 'Card' ? 'WaitPayment' : 'Placed',
              totalPrice:price,
              finalPrice: (price - ((price * req.body.coupon?.discountAmount || 0 )/100)),
              couponId:req.body.coupon?._id,
              note,
              reason
            })


            if(order.paymentMethod == 'Card'){
                if(req.body.coupon){
                    const coupon = await stripe.coupons.create({
                        percent_off:req.body.coupon.discountAmount,
                        duration:'once'
                    })
                    req.body.stripeCoupon = coupon.id
                }
                const session = await stripe.checkout.sessions.create({
                    payment_method_types:['card'],
                    mode:"payment",
                    customer_email:req.user.email,
                    success_url:process.env.success_url,
                    cancel_url:process.env.cancel_url,
                    metadata:{
                        orderId : order._id.toString()
                    },
                    discounts:[{
                        coupon:req.body.stripeCoupon
                    }],
                    
                    line_items:existingProducts.map((ele)=>{
                        return {
                            price_data:{
                                currency:"EGP",
                                product_data:{
                                    name:ele.name,
                                    images:[ele.image]
                                },
                                unit_amount:(ele.paymentPrice * 100),
                            },
                            quantity:ele.quantity
                        }
                    })
                })
                return res.json(session)
                
            }


            //Mark User That Used Coupon
            if(coupon){
                await couponModel.findByIdAndUpdate(req.body.coupon._id,{
                    $addToSet:{
                        usedBy:req.user._id
                }})
            }
            //Delete Selected Items From the Cart If Existed And In Case Used Cart's Products Will Make It Empty
            if(req.body.products){
                await cartModel.findOneAndUpdate({userId:req.user._id},{
                    $pull:{
                        products:{
                            productId:{ $in:productsIds}
                        }
                    }
                })
            }else{
                await cartModel.findOneAndUpdate({userId:req.user._id},{products : []})
            }
            //Decreament Stock And Increament SoldItems
            // for (const product of existingProducts) {
            //     await productModel.findOneAndUpdate({_id:product.productId},{ $inc: {stock : -product.quantity, soldItems:product.quantity}})
            // }




        res.json(order)
    }




    export const stripeWebHook = asyncHandler(async(req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;
      
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.send.endpointSecret);
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
          case 'checkout.session.completed':
            const {orderId} = event.data.object.metadata
            await order.orderModel.findOneAndUpdate({_id:orderId},{status:'Placed'})
            break;
          // ... handle other event types
          default:
            await order.orderModel.findOneAndUpdate({_id:orderId},{status:'Rejected'})
        }
      })
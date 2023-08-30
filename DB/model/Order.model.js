import mongoose, { model, Schema, Types } from "mongoose";

const orderSchema = new Schema({
    userId:{
        type:Types.ObjectId ,
        ref:"User",
        required:true
    },
    products:[
        {
            productId :{
                type:Types.ObjectId,
                ref:'Product',
                required: true
            },
            quantity:{
            type:Number,
            default:1
            }
        }
    ],
  phone:[
    {
        type:String,
        required:true
      }
  ],
  adresse:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:"Placed",
    enum:['Placed', 'WaitPayment', "Canceled", 'Rejected', 'Rood', 'Delivered']
  },
  paymentMethod:{
    type:String,
    enum:["Cash","Card"],
    default:"Cash"
  },
  totalPrice:{
    type:Number,
    default:0
  },
  finalPrice:{
    type:Number,
    default:0
  },
  couponId:{
    type:Types.ObjectId,
    ref:"Coupon"
  },
  note:String,
  reason:String,
}
,
  {
    timestamps: true,
  }
);



const orderModel = mongoose.models.Order || model("Order", orderSchema);

export default orderModel;

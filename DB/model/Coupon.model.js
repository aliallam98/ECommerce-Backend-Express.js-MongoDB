import mongoose, { model, Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    image: { secure_url: {type: String}, public_id: { type: String } },
    discountAmount:{type:Number, default:'1', max:'100',required:true},
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    usedBy:[{type:Types.ObjectId, ref:"User"}],
    expireDate:{
      type: Date,
      min:Date.now()
    },
    maxUsingCounts:Number
  },
  {
    timestamps: true,
  }
);





const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema);

export default couponModel;

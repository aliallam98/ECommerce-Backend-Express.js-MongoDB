import mongoose, { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema({
    createdBy:{
        type:Types.ObjectId ,
        ref:"User",
        required:true
    },
    productId:{
        type:Types.ObjectId ,
        ref:"Product",
        required:true
    },
  comment:String,
  rating:{
    type:Number,
    required:true,
    max:5
  }
}
,
  {
    timestamps: true,
  }
);



const reviewModel = mongoose.models.Review || model("Review", reviewSchema);

export default reviewModel;

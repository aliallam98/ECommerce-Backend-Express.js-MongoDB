import mongoose, { model, Schema, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    image: { secure_url: { type: String, required:true }, public_id: { type: String,required:true  } },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON:{virtuals:true}
  }
);

brandSchema.virtual('Products',{
  localField:"_id",
  foreignField:"brandId",
  ref:"Product"
})



const brandModel = mongoose.models.Brand || model("Brand", brandSchema);

export default brandModel;

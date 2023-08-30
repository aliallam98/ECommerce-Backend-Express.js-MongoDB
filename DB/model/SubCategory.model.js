import mongoose, { model, Schema, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    image: { secure_url: { type: String, required:true }, public_id: { type: String,required:true  } },
    createdBy: { type: Types.ObjectId, ref: "User", required: false },
    categoryId : {type:Types.ObjectId,ref:"Category", required:true}
  },
  {
    timestamps: true,
    toJSON:{virtuals:true}
  }
);

subCategorySchema.virtual('Products',{
  localField:"_id",
  foreignField:"subCategoryId",
  ref:"Product"
})
const subCategoryModel = mongoose.models.SubCategory || model("SubCategory", subCategorySchema);

export default subCategoryModel;

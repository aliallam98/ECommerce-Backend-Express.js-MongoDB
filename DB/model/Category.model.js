import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
categorySchema.virtual('products',{
  localField:"_id",
  foreignField:"categoryId",
  ref:"Product"
})

const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);

export default categoryModel;

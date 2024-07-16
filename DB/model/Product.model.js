import mongoose, { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    paymentPrice: { type: Number, required: true },
    colors: [],
    sizes: [],
    isOnSales: Boolean,
    discountByPercent: Number,
    discountByAmount: Number,
    image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    images: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String },
      },
    ],
    categoryId: {
      type: Types.ObjectId,
      required: true,
      ref: "Category",
      required: false,
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    brandId: { type: Types.ObjectId, ref: "Brand" },
    avgRate: { type: Number, default: "0" },
    ratesNumbers: { type: Number, default: "0" },
    soldItems: { type: Number, default: "0" },
    createdBy: { type: Types.ObjectId, required: true, ref: "User" },
    wishList: [{ type: Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON:{virtuals:true}
  }
);

const productModel = mongoose.models.Product || model("Product", productSchema);

export default productModel;

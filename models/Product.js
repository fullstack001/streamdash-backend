import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  credit: { type: String, require: true },
  id: { type: String, require: true },
  priceCAD: { type: Number },
  priceUSD: { type: Number },
  discount: { type: Number },
  couponCode: { type: String },
  couponActive: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const Product = mongoose.model("product", ProductSchema);
export default Product;

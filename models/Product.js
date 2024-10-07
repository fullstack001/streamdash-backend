import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  credit: { type: String, require: true },
  id: { type: String, require: true },
  priceCAD: { type: Number },
  priceUSD: { type: Number },

  date: { type: Date, default: Date.now },
});

const Product = mongoose.model("product", ProductSchema);
export default Product;

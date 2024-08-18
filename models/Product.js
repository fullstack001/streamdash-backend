import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  transfers: {
    type: String,
  },
  ad_claim: {
    type: String,
  },
  ch_claim: {
    type: String,
  },
  cur: {
    type: String,
  },
  item: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("product", ProductSchema);

export default Product;

import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
  title: { type: String, require: true },
  content: { type: String, require: true },

  date: { type: Date, default: Date.now },
});

const Promotion = mongoose.model("promotion", PromotionSchema);
export default Promotion;

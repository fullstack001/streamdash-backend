import mongoose from "mongoose";

const CreditSchema = new mongoose.Schema({
  email: { type: String, require: true },
  credit: { type: Number, require: true },
  action: { type: String, require: true },
  mac: { type: String },
  userId: { type: String },
  date: { type: Date, default: Date.now },
});

const Credit = mongoose.model("credit", CreditSchema);
export default Credit;

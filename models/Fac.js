import mongoose from "mongoose";

const FacSchema = new mongoose.Schema({
  title: { type: String, require: true },
  content: { type: String, require: true },
  date: { type: Date, default: Date.now },
});

const Fac = mongoose.model("fac", FacSchema);
export default Fac;

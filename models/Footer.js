import mongoose from "mongoose";

const FooterSchema = new mongoose.Schema({
  title: { type: String, require: true },
  content: { type: String, require: true },

  date: { type: Date, default: Date.now },
});

const Footer = mongoose.model("footer", FooterSchema);
export default Footer;

import mongoose from "mongoose";

const AgencySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    default: "",
  },
  tel: {
    type: String,
    default: "",
  },
  name2: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  statut: {
    type: String,
  },
  tax: {
    type: String,
  },
  tax_regno: {
    type: String,
  },
  vat_amt: {
    type: String,
  },
  acc_code: {
    type: String,
  },
  pay_term: {
    type: String,
  },
  credit_term: {
    type: String,
  },
  paymode: {
    type: String,
  },
  reg_no: {
    type: String,
  },
  vat_type: {
    type: String,
  },
  ppostal_addr: {
    type: String,
  },
  ppostal_addr1: {
    type: String,
  },
  ppostal_addr2: {
    type: String,
  },
  ppostal_addr3: {
    type: String,
  },
  ppostal_country: {
    type: String,
  },
  billing_addr1: {
    type: String,
  },
  billing_addr2: {
    type: String,
  },
  billing_addr3: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Agency = mongoose.model("agency", AgencySchema);

export default Agency;

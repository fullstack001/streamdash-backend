import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  h_group: {
    type: String,
    default: "",
  },
  h_addr: {
    type: String,
    default: "",
  },
  h_region: {
    type: String,
  },
  h_plan_region: {
    type: String,
  },
  category_hotel: {
    type: String,
  },
  price_rack: {
    type: String,
  },
  cost_price: {
    type: String,
  },
  selling_price2: {
    type: String,
  },
  h_category: {
    type: String,
  },
  h_general: {
    type: String,
  },
  h_from: {
    type: String,
  },
  h_to: {
    type: String,
  },
  h_street: {
    type: String,
  },
  h_town: {
    type: String,
  },
  h_country: {
    type: String,
  },
  fini: {
    type: String,
  },
  active: {
    type: String,
  },
  h_ishotel: {
    type: String,
  },
  h_isweb: {
    type: String,
  },
  h_image: {
    type: String,
  },
  h_ext: {
    type: String,
  },
  h_description: {
    type: String,
  },
  h_check_in: {
    type: String,
  },
  h_check_out: {
    type: String,
  },
  h_late_check_out: {
    type: String,
  },
  h_num_floors: {
    type: String,
  },
  h_num_guest: {
    type: String,
  },
  h_num_suite: {
    type: String,
  },
  h_num_singlebedded: {
    type: String,
  },
  h_internet_fee: {
    type: String,
  },
  h_service_provider: {
    type: String,
  },
  h_wireless_fee: {
    type: String,
  },
  h_wireless_provider: {
    type: String,
  },
  h_language: {
    type: String,
  },
  h_pet: {
    type: String,
  },
  h_currency: {
    type: String,
  },
  h_facilities: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Hotel = mongoose.model("hotel", HotelSchema);

export default Hotel;

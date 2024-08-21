import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
  email: { type: String, require: true },
  mac: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  date: { type: Date, default: Date.now },
});

const Device = mongoose.model("device", DeviceSchema);
export default Device;

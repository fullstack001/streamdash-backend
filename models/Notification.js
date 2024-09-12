import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: { type: String, require: true },
  content: { type: String, require: true },

  date: { type: Date, default: Date.now },
});

const Notification = mongoose.model("notification", NotificationSchema);
export default Notification;

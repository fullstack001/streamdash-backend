import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  follower: {
    type: String,
    require: false,
  },
  following: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("user", UserSchema);
export default User;

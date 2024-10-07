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
  free_device: {
    type: Number,
    default: 0,
  },
  validationCode: {
    type: Number,
    required: false, // Optional until user signs up
  },
  isActive: {
    type: Boolean,
    default: false, // By default, new users are inactive until they verify their email
  },
  resetPasswordToken: String, // Token for resetting the password
  resetPasswordExpires: Date, // Token expiration time
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema);
export default User;

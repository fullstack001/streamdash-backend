import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mg from "mailgun-js";
import jwtSecret from "../../config/jwtSecret";

import User from "../../models/User";
import Credit from "../../models/Credit";

dotenv.config();

const router = express.Router();

// Initialize Mailgun
const mailgun = mg({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// @route    POST api/auth/signin
// @desc     Register user
// @access   Public
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "password" });
    }

    const payload = {
      user: {
        name: user.name,
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        credit: user.credit,
        following: user.following,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/getUserData", async (req, res) => {
  try {
    const newUserData = await User.findOne({ email: req.body.email });
    const payload = {
      user: {
        name: newUserData.name,
        id: newUserData._id,
        email: newUserData.email,
        isAdmin: newUserData.isAdmin,
        credit: newUserData.credit,
        free_device: newUserData.free_device,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/get-all-user-data", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/auth/signup
// @desc     Register user and send email validation code
// @access   Public
router.post("/signup", async (req, res) => {
  const { nameUser, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "exist" });
    }

    // Create new user but inactive until they validate their email
    const validationCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    user = new User({
      name: nameUser,
      email: email,
      password: password,
      validationCode,
      isActive: false, // Mark as inactive until email is validated
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Send validation code to user's email using Mailgun
    const emailData = {
      from: "no-reply@streamdash.co",
      to: email,
      subject: "Email Verification Code",
      text: `Hi ${nameUser},\n\nYour verification code is: ${validationCode}\n\nPlease use this code to verify your account.\n`,
    };

    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        return res
          .status(500)
          .json({ msg: "Failed to send verification email" });
      }
      res.status(200).json({
        msg: "Signup successful. Verification code sent to your email.",
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/auth/verify-email
// @desc     Verify email and activate user
// @access   Public
router.post("/verify-email", async (req, res) => {
  const { email, validationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || Number(user.validationCode) != Number(validationCode)) {
      return res.status(400).json({ msg: "Invalid code" });
    }

    // Activate the user
    user.isActive = true;
    user.validationCode = undefined; // Clear the validation code
    await user.save();

    const newUserData = await User.findOne({ email });

    const payload = {
      user: {
        name: newUserData.name,
        id: newUserData._id,
        email: newUserData.email,
        isAdmin: newUserData.isAdmin,
        credit: newUserData.credit,
        free_device: newUserData.free_device,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1 days" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

// @route    POST api/auth/changeuser
// @desc     change user data
// @access   Private

router.post("/changeuser/:id", async (req, res) => {
  const user = User.findById(req.params.id);
  const { name, email } = req.body;
  if (!user) return res.status(404).json({ msg: "User not find" });
  try {
    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true } // Return the updated user
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "The email already exist" });
  }
});

// @route    POST api/auth/changepass
// @desc     change user password
// @access   Private

router.post("/changepass/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  const { oldPass, newPass } = req.body;
  if (!user) return res.status(400).json({ msg: "User not find" });

  const isMatch = await bcrypt.compare(oldPass, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Old password not mached" });
  }

  if (oldPass == newPass) {
    return res.status(400).json({ msg: "You already use this password" });
  }

  try {
    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPass, salt);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { password },
      { new: true } // Return the updated user
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "The email already exist" });
  }
});

// @route    POST api/auth/reset-password-request
// @desc     Request password reset
// @access   Public
router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "No user found with this email" });
    }

    // Generate a reset token that expires in 1 hour
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 hour from now

    // Store the token and expiration in the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpire;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Mailgun email configuration
    const data = {
      from: "no-reply@yourdomain.com",
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) requested to reset the password for your account.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    // Send the email
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        return res.status(500).json({ msg: "Failed to send email" });
      }
      res.json({ msg: "Reset link sent to your email" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/auth/reset-password
// @desc     Reset the user's password
// @access   Public
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    // Find the user by the reset token and check if the token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is still valid
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Hash the new password and update it in the user's record
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear the expiration

    await user.save();

    res.json({ msg: "Password successfully reset" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/add-credit-by-admin", async (req, res) => {
  const { email, credit } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.credit = (Number(user.credit) || 0) + Number(credit);
    user.free_device = 1;
    await user.save();

    const newCredit = new Credit({
      email,
      credit,
      action: "Add credit by admin",
    });
    await newCredit.save();

    const users = await User.find();
    res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error processing request" });
  }
});

router.post("/add-user-by-admin", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "exist" });
    }

    // Create new user but inactive until they validate their email
    user = new User({
      name: userName,
      email: email,
      password: password,
      isActive: true, // Mark as inactive until email is validated
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const users = await User.find();
    res.status(200).json({
      data: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

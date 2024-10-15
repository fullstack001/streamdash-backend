
import jwt from "jsonwebtoken";
import jwtSecret from "../../config/jwtSecret";
import express from "express";
import addCreditToDevice from "../../actions/addCreditToDevice";
import { updateExpiry } from "../../config/globals";


import Credit from "../../models/Credit.js";
import User from "../../models/User.js";

const router = express.Router();

function calculateExpiryDate(credit) {
  const now = new Date();
  const expiryDate = new Date(now.setMonth(now.getMonth() + credit)); // 'credit' months from now

  return expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}


router.post("/", async (req, res) => {
  const { id, email, credits } = req.body; 
  try {
    await addCreditToDevice(id, credits);
    const expiryDate = calculateExpiryDate(credits);
    const data =await updateExpiry(id, expiryDate);
    const newCredit = new Credit({
      email: email,
      credit: credits,
      action: "Add Credit to device",
      userId: id,
    });

    await newCredit.save();
    const user = await User.findOne({ email });
    user.credit = Number(user.credit) - Number(credits);
    await user.save();
    const newUser = await User.findOne({ email });
    const payload = {
      user: {
        name: newUser.name,
        id: newUser._id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        credit: newUser.credit,
        following: newUser.following,
        free_device: newUser.free_device,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token: token, data: data });
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(402).json("Failed to submit the form or fetch data.");
  } finally {
    await driver.quit();
  }
});


export default router;

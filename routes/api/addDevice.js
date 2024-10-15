import express from "express";
import jwt from "jsonwebtoken";
import jwtSecret from "../../config/jwtSecret";
import fs from "fs";
import addDevice from "../../actions/addDevice";
import { addDeviceData } from "../../config/globals";


import Device from "../../models/Device.js";
import User from "../../models/User.js";
import Credit from "../../models/Credit.js";

const router = express.Router();

// Add this function at the end of the file
function calculateExpiryDate(credit) {
  const now = new Date();
  let expiryDate;

  if (credit < 1) {
    expiryDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  } else {
    expiryDate = new Date(now.setMonth(now.getMonth() + credit)); // 'credit' months from now
  }

  return expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}


router.post("/", async (req, res) => {
  const { email, name, username, password, mac, credit } = req.body;
 
  try {
    await addDevice(name, username, password, mac, credit);
   
    const expiryDate = calculateExpiryDate(credit);
    const newDevicdData = {
      loginId: username,
      name: name,
      mac: mac,
      password: password,
      status: "ACTIVE",
      expiry:expiryDate,
      comments: '',
    };

    const data =  await addDeviceData(newDevicdData);
    const device = new Device({
      email: email,
      mac: mac,
      username: username,
      password: password,
    });
    await device.save();

    const devices = await Device.find({ email });

    if (credit > 0) {
      let user = await User.findOne({ email });
      user.credit = Number(user.credit) - Number(credit);
      user.free_device = 2;
      await user.save();

      const newCredit = new Credit({
        email: email,
        credit: credit,
        action: "Add device with credit.",
      });

      await newCredit.save();

      const payload = {
        user: {
          name: user.name,
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          credit: Number(user.credit) - Number(credit),
          following: user.following,
          free_device: user.free_device,
        },
      };

     

      jwt.sign(payload, jwtSecret, { expiresIn: "1 days" }, (err, token) => {
        if (err) throw err;
        res.json({ token: token, data: data, userDevices: devices });
      });
    } else {
      let user = await User.findOne({ email });
      user.free_device = 2;
      await user.save();
      res.json({ data: data, userDevices: devices });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;

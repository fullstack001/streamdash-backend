import express from "express";

import Device from "../../models/Device";
const router = express.Router();

router.post("/", async (req, res) => {
    const { email, device } = req.body;
    console.log(req.body)
    console.log(email, device)
  try {
     const newDevice = new Device({
      email: email,
      mac: device.mac,
      username: device.loginId,
      password:"",
    });
    await newDevice.save();
    res.json({ message: "Device assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign device" });
  }
});

module.exports = router;

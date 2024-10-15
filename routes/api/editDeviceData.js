
import express from "express";
import editDevice from "../../actions/editDevice";

import Device from "../../models/Device.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { id, name, password, mac } = req.body;
  // Setup WebDriver
  try {
    await editDevice(id, name, password, mac);
    const device = await Device.findOne({ username: id });

    device.name = name;
    device.mac = mac;
    device.password = password;
    await device.save();  
    const devices = await Device.find({ username: id });

    res.json({ data: devices });
  } catch (error) {
    console.error("Error:", error);

    res.status(402).json("Failed to submit the form.");
  } 
});

export default router;

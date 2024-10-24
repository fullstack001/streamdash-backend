import express from "express";
import deleteDevice from "../../actions/deleteDevice.js";
const router = express.Router();

import Device from "../../models/Device.js";



router.post("/", async (req, res) => {
  const { username } = req.body;
  try {
    const device = await Device.findOne({ username });
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Delete the device from the database
    await Device.deleteOne({ _id: device._id });

    // Run the deleteDevice function
    deleteDevice(username);

    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to delete the device" });
  } 
});

module.exports = router;

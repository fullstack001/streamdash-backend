
import express from "express";
import deleteDevice from "../../actions/deleteDevice.js";
const router = express.Router();



router.post("/", async (req, res) => {
  const { username } = req.body;
  try {
    deleteDevice(username);
    res.json("success");
  } catch (error) {
    console.error("Error:", error);
    res.status(402).json("Failed to submit the form.");
  } 
});

module.exports = router;

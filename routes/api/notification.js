import express from "express";
import Notification from "../../models/Notification";

const router = express.Router();

// Get the single notification
router.get("/", async (req, res) => {
  try {
    const notification = await Notification.findOne(); // Find one notification
    if (!notification) {
      return res.status(404).json({ msg: "No notification found" });
    }
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to retrieve data" });
  }
});

// Create or Update the single notification
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  try {
    let notification = await Notification.findOne(); // Check if it exists
    if (notification) {
      // If exists, update it
      notification.title = title;
      notification.content = content;
      notification = await notification.save();
      res.json({ msg: "Notification updated", notification });
    } else {
      // Otherwise, create a new one
      notification = new Notification({ title, content });
      await notification.save();
      res.json({ msg: "Notification created", notification });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to save notification" });
  }
});

export default router;

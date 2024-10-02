import express from "express";
import Promotion from "../../models/Promotion";

const router = express.Router();

// Get the single promotion
router.get("/", async (req, res) => {
  try {
    const promotion = await Promotion.findOne(); // Find one promotion
    if (!promotion) {
      return res.status(404).json({ msg: "No promotion found" });
    }
    res.json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to retrieve data" });
  }
});

// Create or Update the single promotion
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  try {
    let promotion = await Promotion.findOne(); // Check if it exists
    if (promotion) {
      // If exists, update it
      promotion.title = title;
      promotion.content = content;
      promotion = await promotion.save();
      res.json({ msg: "promotion updated", promotion });
    } else {
      // Otherwise, create a new one
      promotion = new Promotion({ title, content });
      await promotion.save();
      res.json({ msg: "promotion created", promotion });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to save promotion" });
  }
});

export default router;

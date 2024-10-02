import express from "express";
import Footer from "../../models/Footer";

const router = express.Router();

// Get the single Footer
router.get("/", async (req, res) => {
  try {
    const footer = await Footer.findOne(); // Find one Footer
    if (!footer) {
      return res.status(404).json({ msg: "No Footer found" });
    }
    res.json(footer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to retrieve data" });
  }
});

// Create or Update the single footer
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  try {
    let footer = await Footer.findOne(); // Check if it exists
    if (footer) {
      // If exists, update it
      footer.title = title;
      footer.content = content;
      footer = await footer.save();
      res.json({ msg: "Footer updated", footer });
    } else {
      // Otherwise, create a new one
      footer = new Footer({ title, content });
      await footer.save();
      res.json({ msg: "Footer created", footer });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to save Footer" });
  }
});

export default router;

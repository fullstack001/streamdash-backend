import express from "express";
import Fac from "../../models/Fac";

const router = express.Router();

// Get the single fac
router.get("/", async (req, res) => {
  try {
    const fac = await Fac.find(); // Find one fac
    if (!fac) {
      return res.status(404).json({ msg: "No fac found" });
    }
    res.json(fac);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to retrieve data" });
  }
});

// Create or Update the single fac
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  try {
    const fac = new Fac({ title, content });
    await fac.save();
    res.json({ msg: "fac created", fac });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to save fac" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    // Attempt to delete the record by ID
    const result = await Fac.deleteOne({ _id: req.body.id });

    // Check if the record was deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Fac not found" });
    }

    res.json({ msg: "Fac deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to delete fac" });
  }
});

router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  try {
    const id = req.params.id;
    // Find the record by id
    let fac = await Fac.findById(id);
    fac.title = title;
    fac.content = content;
    fac = await fac.save();
    res.json({ msg: "fac updated" });
    // Otherwise, create a new one
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to save fac" });
  }
});

export default router;

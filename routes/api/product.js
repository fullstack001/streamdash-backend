import express from "express";
import Product from "../../models/Product";

const router = express.Router();

// Get the single Product
router.get("/", async (req, res) => {
  try {
    const product = await Product.find(); // Find one Product
    if (!product) {
      return res.status(404).json({ msg: "No Product found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to retrieve data" });
  }
});

router.put("/:id", async (req, res) => {
  const { priceCAD, priceUSD } = req.body;

  try {
    const id = req.params.id;
    // Find the record by id
    let product = await Product.findById(id);
    product.priceCAD = priceCAD;
    product.priceUSD = priceUSD;
    product = await product.save();
    res.json({ msg: "Product updated" });
    // Otherwise, create a new one
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to save Product" });
  }
});

export default router;

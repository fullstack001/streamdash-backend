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
  const { priceCAD, priceUSD, discount, couponCode, couponActive } = req.body;

  try {
    const id = req.params.id;
    // Find the record by id
    let product = await Product.findById(id);
    product.priceCAD = priceCAD;
    product.priceUSD = priceUSD;
    product.discount = discount;
    product.couponCode = couponCode;
    product.couponActive = couponActive;
    product = await product.save();
    res.json({ msg: "Product updated" });
    // Otherwise, create a new one
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to save Product" });
  }
});

router.get("/coupon-show/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product.couponActive);
  } catch (error) {
    console.error(error);
    res.status(500).json(false);
  }
});

router.post("/apply-coupon", async (req, res) => {
  const { couponCode } = req.body;
  try {
    const product = await Product.findOne({ couponCode: couponCode });
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    if (product.couponCode === couponCode && product.couponActive) {
      res.json({ discount: product.discount });
    } else {
      res.status(400).json({ msg: "Invalid coupon code" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to apply coupon" });
  }
});

export default router;

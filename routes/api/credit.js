import express from "express";
import Credit from "../../models/Credit";
import User from "../../models/User";

const router = express.Router();

router.post("/buy-credit", async (req, res) => {
  const { email, credit } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.credit = (user.credit || 0) + credit;
    await user.save();

    const newCredit = new Credit({
      email,
      credit,
      action: "Buy credit",
    });
    await newCredit.save();

    res.json({ msg: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error processing request" });
  }
});

export default router;

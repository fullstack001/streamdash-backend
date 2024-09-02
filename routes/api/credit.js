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

    user.credit = (Number(user.credit) || 0) + Number(credit);
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

router.get("/", async (req, res) => {
  try {
    const history = await Credit.find();
    res.json(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "get data error" });
  }
});

router.post("/getuserhistory", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    const history = await Credit.find({ email });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to retrieve data" });
  }
});

export default router;

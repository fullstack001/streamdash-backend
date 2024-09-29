import express from "express";
import mg from "mailgun-js";
import dotenv from "dotenv";
import Credit from "../../models/Credit";
import User from "../../models/User";
import { purchaseEmainContent } from "../../config/mailtemplate";
dotenv.config();

const router = express.Router();

const products = [
  { credit: 1, price: 20 },
  { credit: 6, price: 60 },
  { credit: 12, price: 150 },
  { credit: 50, price: 450 },
];

// Initialize Mailgun
const mailgun = mg({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

router.post("/buy-credit", async (req, res) => {
  const { email, credit } = req.body;
  const product = products.find((item) => item.credit === Number(credit));
  const price = product ? product.price : null;
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  console.log(email, credit, formattedDate, price);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.credit = (Number(user.credit) || 0) + Number(credit);
    user.free_device = 1;
    await user.save();

    const newCredit = new Credit({
      email,
      credit,
      action: "Buy credit",
    });
    await newCredit.save();

    const htmlContent = purchaseEmainContent(
      user.email,
      credit,
      formattedDate,
      price
    );

    // Mailgun email configurations
    const data = {
      from: "support@yourdomain.com",
      to: user.email,
      subject: "Your StreamDash Credit Purchase is Confirmed!",
      html: htmlContent,
    };

    // Send the email
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        return res.status(500).json({ msg: "Failed to send email" });
      }
      res.json({ msg: "Email sent successfully" });
    });
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


import express from "express";
import dotenv from "dotenv";
import { getFetchedData} from "../../config/globals.js";

dotenv.config();

const router = express.Router();
import Device from "../../models/Device";
import User from "../../models/User";

router.post("/", async (req, res) => {
  const { email } = req.body; 
 try{
    const user = await User.findOne({ email });

   const data = getFetchedData();
    const userDevice = user.isAdmin
      ? await Device.find()
      : await Device.find({ email });

    res.json({ data: data, userDevice: userDevice });
  } catch (error) {
    console.error(error);
    res.status(402).json({ error: "get Data Error" });
  } 
});

module.exports = router;

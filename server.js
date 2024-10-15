import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

import './config/globals';  // Import globals first
import connectDB from "./config/database";
import createAdmin from "./config/createAdmin";
import startDataFetcher from "./config/dataFetcher";

import auth from "./routes/api/auth";
import admin from "./routes/api/admin";
import addDevice from "./routes/api/addDevice";
import getDevices from "./routes/api/getDevices";
import deleteDevice from "./routes/api/deleteDevice";
import editDeviceData from "./routes/api/editDeviceData";
import addCreditDevice from "./routes/api/addcreditdevice";
import payment from "./routes/api/payment";
import credit from "./routes/api/credit";
import notification from "./routes/api/notification";
import fac from "./routes/api/fac";
import promotion from "./routes/api/promotion";
import footer from "./routes/api/footer";
import product from "./routes/api/product";

dotenv.config();

const app = express();

connectDB();
createAdmin();
startDataFetcher(); // Start the data fetcher

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2000mb", extended: false }));
app.use(cors("*"));

app.use("/api/auth", auth);
app.use("/api/admin", admin);
app.use("/api/addDevice", addDevice);
app.use("/api/getDevices", getDevices);
app.use("/api/deleteDevice", deleteDevice);
app.use("/api/edit-device", editDeviceData);
app.use("/api/add-credit-device", addCreditDevice);
app.use("/api/payment", payment);
app.use("/api/credit", credit);
app.use("/api/notification", notification);
app.use("/api/facs", fac);
app.use("/api/promotion", promotion);
app.use("/api/footer", footer);
app.use("/api/product", product);

// Add this new route for the meta image
app.get('/meta-image/image.png', (req, res) => {
  const imagePath = path.join(__dirname, 'image.png');
  res.sendFile(imagePath);
});

// // Serve the form
app.get("/", (req, res) => {
  res.send(`
        <form action="/submit" method="post">
            Name: <input type="text" name="name"><br>
            Username: <input type="text" name="username"><br>
            Password: <input type="password" name="password"><br>
            MAC: <input type="text" name="mac"><br>
            <input type="submit" value="Submit">
        </form>
    `);
});
const port = process.env.PORT || 5033;
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});

import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/database";
import createAdmin from "./config/createAdmin";

import auth from "./routes/api/auth";
import admin from "./routes/api/admin";
import addDevice from "./routes/api/addDevice";
import getDevices from "./routes/api/getDevices";

dotenv.config();

const app = express();

connectDB();
createAdmin();
// saveData();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2000mb", extended: false }));
app.use(cors({ origin: "*" }));

app.use("/api/auth", auth);
app.use("/api/admin", admin);
app.use("/api/addDevice", addDevice);
app.use("/api/getDevices", getDevices);

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
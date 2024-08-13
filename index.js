import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import addDevice from "./routes/addDevice";
import getDevices from "./routes/getDevices";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2000mb", extended: false }));
app.use(cors({ origin: "*" }));

// // Serve the form
// app.get("/", (req, res) => {
//   res.send(`
//         <form action="/submit" method="post">
//             Name: <input type="text" name="name"><br>
//             Username: <input type="text" name="username"><br>
//             Password: <input type="password" name="password"><br>
//             MAC: <input type="text" name="mac"><br>
//             <input type="submit" value="Submit">
//         </form>
//     `);
// });

app.use("/api/addDevice", addDevice);
app.use("/api/getDevices", getDevices);

app.listen(5033, () => {
  console.log("Server running on http://localhost:5000");
});

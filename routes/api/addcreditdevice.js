import { Builder, By, Key, until, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import express from "express";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import jwtSecret from "../../config/jwtSecret";

import Credit from "../../models/Credit.js";
import User from "../../models/User.js";

const router = express.Router();

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post("/", async (req, res) => {
  const { id, email, credits } = req.body;

  // Setup WebDriver
  let options = new chrome.Options();
  options.addArguments("--headless"); // Runs Chrome in headless mode
  options.addArguments("--disable-gpu"); // Applicable to Windows OS only
  options.addArguments("--no-sandbox"); // Bypass OS security model
  options.addArguments("window-size=1920x1080"); // Set the window size

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Login to the website
    await driver.get("https://billing.nexatv.live/login");
    await driver.findElement(By.name("login")).sendKeys("vrushankshah");
    await driver
      .findElement(By.name("password"))
      .sendKeys("vrushankshah", Key.RETURN);

    // Navigate to the edit page
    await driver.get(`https://billing.nexatv.live/dealer/users/edit/${id}`);
    await sleep(5000);

    const selectElement = await driver.findElement(By.name("credits"));
    const select = new Select(selectElement);
    await select.selectByValue(credits.toString());

    // Select ADD type for the form (as default is checked, no need to change)
    await driver
      .findElement(By.css('input[name="type"][value="CRDT"]'))
      .click();

    // Find and click the submit button
    const submitButton = await driver.findElement(
      By.xpath(
        `//form[@action='https://billing.nexatv.live/dealer/users/renew/${id}']//button[@type='submit' and contains(@class, 'btn btn-sm btn-success')]`
      )
    );
    await submitButton.click();

    // Wait for the form to process submission
    await sleep(5000);

    // After form submission, navigate to the user list page
    await driver.get("https://billing.nexatv.live/dealer/users");

    // Wait until the dropdown for changing page length is present
    const selectElementLength = await driver.wait(
      until.elementLocated(By.name("memListTable_length")),
      5000 // Increased timeout
    );

    // Select the option with value "100"
    const selectLength = new Select(selectElementLength);
    await selectLength.selectByValue("100");

    console.log("Successfully selected 100 rows");

    // Wait until the table is refreshed and the new rows are loaded
    await driver.wait(
      until.elementLocated(By.css("#memListTable tbody tr")),
      5000 // Increased timeout
    );

    console.log("Table rows located");

    // Get the page source after the table is loaded
    const pageSource = await driver.getPageSource();

    // Load the HTML into cheerio for parsing
    const $ = cheerio.load(pageSource);

    // Select the table rows and extract the data
    const rows = [];
    $("#memListTable tbody tr").each((index, element) => {
      const row = {};
      row.loginId = $(element).find("td").eq(0).text().trim();
      row.mac = $(element).find("td").eq(1).text().trim();
      row.name = $(element).find("td").eq(2).text().trim();
      row.comments = $(element).find("td").eq(3).text().trim();
      row.status = $(element).find("td").eq(4).text().trim();
      row.expiry = $(element).find("td").eq(5).text().trim();
      rows.push(row);
    });

    const newCredit = new Credit({
      email: email,
      credit: credits,
      action: "Add Credit to device",
      userId: id,
    });

    await newCredit.save();
    const user = await User.findOne({ email });
    user.credit = Number(user.credit) - Number(credits);
    await user.save();
    const newUser = await User.findOne({ email });
    const payload = {
      user: {
        name: newUser.name,
        id: newUser._id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        credit: newUser.credit,
        following: newUser.following,
        free_device: newUserData.free_device,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token: token, data: rows });
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(402).json("Failed to submit the form or fetch data.");
  } finally {
    await driver.quit();
  }
});

export default router;

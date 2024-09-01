import { Builder, By, Key, until, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import * as cheerio from "cheerio";
import { proxy } from "../../config/proxy.js";
import express from "express";
import fs from "fs";

import Device from "../../models/Device.js";

const router = express.Router();

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post("/", async (req, res) => {
  const { email, name, username, password, mac } = req.body;
  // Setup WebDriver
  let options = new chrome.Options();
  // options.addArguments("--headless"); // Runs Chrome in headless mode
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

    await sleep(5000);

    // Wait for the modal to appear and be clickable
    const modalButton = await driver.wait(
      until.elementLocated(
        By.xpath("//button[@class='btn btn-success' and @data-dismiss='modal']")
      ),
      20000 // Increased timeout to 20 seconds
    );

    await driver.wait(until.elementIsVisible(modalButton), 20000);
    await modalButton.click();

    // Click the 'ADD NEW' button to navigate to the form page
    await driver
      .findElement(
        By.xpath("//a[@href='https://billing.nexatv.live/dealer/users/add']")
      )
      .click();

    // Fill in the form
    await driver.findElement(By.name("name")).sendKeys(name);
    await driver.findElement(By.name("username")).sendKeys(username);
    await driver.findElement(By.name("password")).sendKeys(password);

    const newMac = mac.replace(/:/g, "");
    const macElement = await driver.findElement(By.name("mac"));
    const actions = driver.actions({ async: true });
    await actions.click(macElement).perform();
    await sleep(50);
    for (let i = 0; i < 30; i++) {
      await actions.sendKeys(Key.ARROW_LEFT).perform();
    }
    await sleep(50);
    for (const char of newMac) {
      await actions.sendKeys(char).perform();
      await sleep(10); // Adjust the delay as needed
    }

    await sleep(50);

    await driver
      .findElement(
        By.xpath(
          "//button[@type='submit' and contains(@class, 'btn btn-sm btn-success')]"
        )
      )
      .click();

    // Wait for a few seconds to ensure the form is submitted

    await sleep(5000);

    await driver.get("https://billing.nexatv.live/dealer/users");

    // Wait until the dropdown for changing page length is present
    const selectElement = await driver.wait(
      until.elementLocated(By.name("memListTable_length")),
      10000 // Increased timeout
    );

    // Select the option with value "100"
    const select = new Select(selectElement);
    await select.selectByValue("100");

    console.log("Successfully selected 100 rows");

    // Wait until the table is refreshed and the new rows are loaded
    await driver.wait(
      until.elementLocated(By.css("#memListTable tbody tr")),
      10000 // Increased timeout
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

    const device = new Device({
      email: email,
      mac: mac,
      username: username,
      password: password,
    });
    await device.save();

    const devices = await Device.find({ email });

    res.json({ data: rows, userDevices: devices });
  } catch (error) {
    console.error("Error:", error);

    // Take a screenshot for debugging purposes
    await driver.takeScreenshot().then(function (image, err) {
      fs.writeFile("screenshot.png", image, "base64", function (err) {
        if (err) console.log(err);
      });
    });

    res.status(402).json("Failed to submit the form.");
  } finally {
    await driver.quit();
  }
});

module.exports = router;

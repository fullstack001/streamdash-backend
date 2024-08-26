import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import express from "express";
import fs from "fs";

import Device from "../../models/Device.js";

const router = express.Router();

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post("/", async (req, res) => {
  const { id, name, password, mac } = req.body;
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

    await sleep(5000);

    // Navigate to the edit page
    await driver.get(`https://billing.nexatv.live/dealer/users/edit/${id}`);
    await sleep(5000);

    // Enable the disabled fields using JavaScript
    await driver.executeScript(`
      document.getElementsByName('name')[0].removeAttribute('disabled');
      document.getElementsByName('password')[0].removeAttribute('disabled');
      document.getElementsByName('mac')[0].removeAttribute('disabled');
    `);

    // Fill in the form
    await driver.findElement(By.name("name")).clear();
    await driver.findElement(By.name("name")).sendKeys(name);
    await driver.findElement(By.name("password")).clear();
    await driver.findElement(By.name("password")).sendKeys(password);

    const newMac = mac.replace(/:/g, "");
    const macElement = await driver.findElement(By.name("mac"));
    await macElement.clear();
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

    await sleep(500);

    // Find and click the submit button
    const submitButton = await driver.findElement(
      By.xpath(
        "//form[@id='form_sample_3']//button[@type='submit' and contains(@class, 'btn btn-sm btn-success')]"
      )
    );
    await submitButton.click();

    // Wait for a few seconds to ensure the form is submitted
    await sleep(5000);

    // Save device information in the database
    const device = new Device({
      name: name,
      mac: mac,
      username: id, // Assuming `id` is the username here
      password: password,
    });
    await device.save();

    const devices = await Device.find({ username: id });

    res.json({ data: devices });
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

export default router;

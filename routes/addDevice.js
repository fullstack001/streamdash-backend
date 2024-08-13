import { Builder, By, Key, until, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { proxy } from "../config/proxy.js";
import express from "express";

const router = express.Router();

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post("/", async (req, res) => {
  const { name, username, password, mac } = req.body;
  // Setup WebDriver
  let options = new chrome.Options();
  options.addArguments("--headless"); // Run in headless mode
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");

  // const randomIndex = Math.floor(Math.random() * proxy.length);
  // const proxyAddress = proxy[randomIndex];
  // options.addArguments(`--proxy-server=${proxyAddress}`);

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Login to the website
    await driver.get("https://billing.nexatv.live/login");
    await sleep(1000);
    await driver.findElement(By.name("login")).sendKeys("vrushankshah");
    await driver
      .findElement(By.name("password"))
      .sendKeys("vrushankshah", Key.RETURN);

    // Wait for the modal to appear and click the 'OK' button
    await driver.wait(
      until.elementLocated(
        By.xpath("//button[@class='btn btn-success' and @data-dismiss='modal']")
      ),
      5000
    );
    await driver
      .findElement(
        By.xpath("//button[@class='btn btn-success' and @data-dismiss='modal']")
      )
      .click();

    // Wait for the overlay to disappear
    await driver.wait(
      until.stalenessOf(driver.findElement(By.css(".blockUI.blockOverlay"))),
      5000
    );

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
    await driver.sleep(50);

    res.send("Form submitted successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.send("Failed to submit the form.");
  } finally {
    await driver.quit();
  }
});

module.exports = router;

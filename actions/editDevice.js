import { Builder, By, Key, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
dotenv.config();

const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function editDevice(id, name, password, mac) {
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
    await driver.findElement(By.name("login")).sendKeys(USER_NAME);
    await driver
      .findElement(By.name("password"))
      .sendKeys(PASSWORD, Key.RETURN);

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
    console.log("Device edited");
    // Wait for a few seconds to ensure the form is submitted
    await sleep(5000);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.quit();
  }
}
import { Builder, By, Key, until, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;


// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function deleteDevice(id) {
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
    await driver.findElement(By.name("login")).sendKeys(USER_NAME);
    await driver
      .findElement(By.name("password"))
      .sendKeys(PASSWORD, Key.RETURN);

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

    // Wait until the dropdown for changing page length is present
    const selectElement = await driver.wait(
      until.elementLocated(By.name("memListTable_length")),
      5000 // Increased timeout
    );

     await driver.executeScript(`
      var select = arguments[0];
      var option = document.createElement('option');
      option.value = '1500';
      option.text = '1500';
      select.add(option);
    `, selectElement);

    // Select the option with value "1500"
    const select = new Select(selectElement);
    await select.selectByValue("1500");

    await sleep(2000);

    // Wait until the table is refreshed and the new rows are loaded
    await driver.wait(
      until.elementLocated(By.css("#memListTable tbody tr")),
      120000 // Increased timeout
    );

    console.log("Table rows located");

    await sleep(3000);

    // Adjusted XPath with a more general approach
    const deleteButton = await driver.wait(
      until.elementLocated(
        By.xpath(`//a[contains(@href, '/dealer/users/delete/${id}')]`)
      ),
      5000 // Wait for up to 10 seconds
    );

    //https://billing.nexatv.live/dealer/users/delete/zsttest

    // Click the delete button
    await deleteButton.click();

    // Wait for the confirmation alert and accept it
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await alert.accept();
    await sleep(2000);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.quit();
  }
}
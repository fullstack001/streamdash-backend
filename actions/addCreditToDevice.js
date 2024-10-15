import { Builder, By, Key, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
dotenv.config();

const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function addCreditToDevice(id,  credits) {

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
    }catch(error){
        console.error(error);
    }finally{
        await driver.quit();
    }

}
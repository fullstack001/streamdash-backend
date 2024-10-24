import { Builder, By, Key, until, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
dotenv.config();

const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;

class SeleniumQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  async addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { task, resolve, reject } = this.queue.shift();

    let driver;
    try {
      let options = new chrome.Options();
      options.addArguments("--headless", "--disable-gpu", "--no-sandbox", "window-size=1920x1080");

      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

      await this.login(driver);
      const result = await task(driver);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      if (driver) await driver.quit();
      this.isProcessing = false;
      this.processQueue();
    }
  }

  async login(driver) {
    await driver.get("https://billing.nexatv.live/login");
    await driver.findElement(By.name("login")).sendKeys(USER_NAME);
    await driver.findElement(By.name("password")).sendKeys(PASSWORD, Key.RETURN);

    const modalButton = await driver.wait(
      until.elementLocated(By.xpath("//button[@class='btn btn-success' and @data-dismiss='modal']")),
      10000
    );

    if (await modalButton.isDisplayed()) {
      await modalButton.click();
    }
  }
}

export const seleniumQueue = new SeleniumQueue();


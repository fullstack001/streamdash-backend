import chrome from "selenium-webdriver/chrome.js";

let driver = undefined;

if (global.driver === undefined) {
  let options = new chrome.Options();
  options.addArguments("--headless"); // Runs Chrome in headless mode
  options.addArguments("--disable-gpu"); // Applicable to Windows OS only
  options.addArguments("--no-sandbox"); // Bypass OS security model
  options.addArguments("window-size=1920x1080"); // Set the window size

  global.driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  driver = global.driver;
}

export default driver;

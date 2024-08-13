import { Builder, By, Key, until, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import * as cheerio from "cheerio";
import { proxy } from "../config/proxy.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  let options = new chrome.Options();
  options.addArguments("--headless");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");

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

    // Wait for the modal to appear and click the 'OK' button
    await driver.wait(
      until.elementLocated(
        By.xpath("//button[@class='btn btn-success' and @data-dismiss='modal']")
      ),
      10000 // Increased timeout
    );
    await driver
      .findElement(
        By.xpath("//button[@class='btn btn-success' and @data-dismiss='modal']")
      )
      .click();

    await driver.get("https://billing.nexatv.live/dealer/users");

    // Wait until the dropdown for changing page length is present
    await driver.wait(
      until.elementLocated(By.name("memListTable_length")),
      5000 // Increased timeout
    );

    // Select the option with value "100"
    const selectElement = await driver.findElement(
      By.name("memListTable_length")
    );
    const select = new Select(selectElement);
    await select.selectByValue("100");

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

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "get Data Error" });
  } finally {
    await driver.quit();
  }
});

module.exports = router;

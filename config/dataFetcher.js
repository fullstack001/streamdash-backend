import axios from 'axios';
import { setFetchedData } from './globals';

import { Builder, By, Key, until, Select } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

import { seleniumQueue } from '../utils/seleniumQueue.js';

const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;

const fetchData = async () => {
  try {
    const rows = await seleniumQueue.addTask(async (driver) => {
      await driver.get("https://billing.nexatv.live/dealer/users");

      // Wait until the dropdown for changing page length is present
      const selectElement = await driver.wait(
        until.elementLocated(By.name("memListTable_length")),
        5000 // Increased timeout
      );

      // Add a new option with value "1500"
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

      console.log("Successfully selected 1500 rows");

      // Wait until the table is refreshed and the new rows are loaded
      await driver.wait(
        until.elementLocated(By.css("#memListTable tbody tr")),
        120000 // Increased timeout
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

      return rows;
    });

    console.log(Date.now(), rows.length, rows[0]);
    setFetchedData(rows);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

const startDataFetcher = () => {
  // Fetch data immediately on start
  fetchData();

  // Then fetch data every 7 minutes
  setInterval(fetchData, 10 * 60 * 1000);
};

export default startDataFetcher;

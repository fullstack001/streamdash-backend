import { seleniumQueue } from '../utils/seleniumQueue.js';
import { By, until, Select } from "selenium-webdriver";
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
    try {
      await seleniumQueue.addTask(async (driver) => {
        await driver.get("https://billing.nexatv.live/dealer/users");

        

        // Find the search input and enter the device ID
        const searchInput = await driver.wait(
          until.elementLocated(By.css("input[type='search'][placeholder='Type to search...']")),
          5000
        );
        await searchInput.sendKeys(id);
        await sleep(2000); // Wait for the search results to update
        console.log("Search results updated");

        // Find and click the delete button for the specific device
        const deleteButton = await driver.wait(
          until.elementLocated(
            By.xpath(`//a[contains(@href, '/dealer/users/delete/${id}') and contains(@class, 'btn-danger')]`)
          ),
          5000
        );
        console.log("Delete button found");

        // Click the delete button
        await deleteButton.click();

        // Wait for the confirmation alert and accept it
        await driver.wait(until.alertIsPresent(), 5000);
        const alert = await driver.switchTo().alert();
        await alert.accept();
        await sleep(2000);
        console.log("Device deleted");
      });
    } catch (error) {
      console.error("Error:", error);
    }
}

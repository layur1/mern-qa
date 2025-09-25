const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const os = require("os");

describe("Tasks page", function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    console.log("Starting WebDriver...");
    const options = new chrome.Options().addArguments("--no-sandbox", "--disable-dev-shm-usage");

    // Detect OS and set chromedriver path
    let service;
    if (os.platform() === "win32") {
      service = new chrome.ServiceBuilder(
        "C:\\Users\\Acer\\Desktop\\mern-qa\\node_modules\\chromedriver\\lib\\chromedriver\\chromedriver.exe"
      );
    } else {
      service = new chrome.ServiceBuilder("/usr/bin/chromedriver"); // Linux (GitHub Actions)
    }

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    console.log("✅ WebDriver started successfully.");
  });

  after(async () => {
    if (driver) {
      console.log("Closing WebDriver...");
      await driver.quit();
    }
  });

  it("adds a task and shows it in the list", async () => {
    await driver.get("http://localhost:3000/tasks.html");
    const input = await driver.findElement(By.id("taskInput"));
    await input.sendKeys("Study QA");
    await driver.findElement(By.id("addBtn")).click();

    await driver.sleep(2000); // wait for refresh
    const lis = await driver.findElements(By.css("#tasks li"));

    if (lis.length > 0) {
      const firstLi = await driver.findElement(By.css("#tasks li:first-child"));
      const text = await firstLi.getText();
      expect(text).to.equal("Study QA");
    } else {
      throw new Error("No task elements found after adding task");
    }
  });
});

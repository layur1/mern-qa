const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const os = require("os");
const path = require("path");

describe("Tasks page", function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    console.log("Starting WebDriver...");
    const options = new chrome.Options();
    const args = ["--no-sandbox", "--disable-dev-shm-usage"];
    if (process.env.HEADLESS === "true") {
      args.push("--headless=new");
    }
    options.addArguments(...args);

    let service;
    if (os.platform() === "win32") {
      const chromedriverPath = path.join(__dirname, "..", "..", "node_modules", "chromedriver", "lib", "chromedriver", "chromedriver.exe");
      service = new chrome.ServiceBuilder(chromedriverPath);
    } else {
      service = new chrome.ServiceBuilder();
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

    const taskElement = await driver.wait(until.elementLocated(By.css("#tasks li:first-child")), 10000);
    const text = await taskElement.getText();

    expect(text).to.equal("Study QA");
  });
});
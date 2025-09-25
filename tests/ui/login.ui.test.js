const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const os = require("node:os");
const path = require("node:path");

describe("Login page", function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    console.log("Starting WebDriver setup...");
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

  it("logs in with valid credentials", async () => {
    await driver.get("http://localhost:3000/login.html");

    await driver.findElement(By.id("username")).sendKeys("alice");
    await driver.findElement(By.id("password")).sendKeys("secret");
    await driver.findElement(By.id("loginBtn")).click();

    const msgEl = await driver.wait(until.elementLocated(By.id("welcomeMsg")), 10000);
    const msg = await msgEl.getText();

    expect(msg).to.include("Welcome, alice!");
  });
});
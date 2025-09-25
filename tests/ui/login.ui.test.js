const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const os = require("os");

describe("Login page", function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    console.log("Starting WebDriver setup...");
    const options = new chrome.Options().addArguments("--no-sandbox", "--disable-dev-shm-usage");

    let service;
    if (os.platform() === "win32") {
      service = new chrome.ServiceBuilder(
        "C:\\Users\\Acer\\Desktop\\mern-qa\\node_modules\\chromedriver\\lib\\chromedriver\\chromedriver.exe"
      );
    } else {
      service = new chrome.ServiceBuilder("/usr/bin/chromedriver");
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
      await driver.quit();
    }
  });

  it("logs in with valid credentials", async () => {
    await driver.get("http://localhost:3000/login.html");

    await driver.findElement(By.id("username")).sendKeys("alice");
    await driver.findElement(By.id("password")).sendKeys("secret");
    await driver.findElement(By.id("loginBtn")).click();

    await driver.sleep(2000);
    const msgEl = await driver.wait(until.elementLocated(By.id("welcomeMsg")), 10000);
    const msg = await msgEl.getText();

    expect(msg).to.include("Welcome, alice!");
  });
});

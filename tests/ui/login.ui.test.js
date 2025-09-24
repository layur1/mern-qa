const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");

describe("Login page", function () {
  this.timeout(60000); // give CI plenty of time
  let driver;

  before(async () => {
    try {
      console.log("Starting WebDriver setup...");

      const options = new chrome.Options()
        .addArguments("--no-sandbox", "--disable-dev-shm-usage");

      // Force Chrome path on Windows
      const localChrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
      options.setChromeBinaryPath(localChrome);

      // If CI provides its own Chrome, override
      if (process.env.CHROME_PATH) {
        console.log("CHROME_PATH detected in env:", process.env.CHROME_PATH);
        options.setChromeBinaryPath(process.env.CHROME_PATH);
      }

      // Debug log to confirm final path being used
      console.log("Using Chrome at:", options.options_.binary);

      // Explicitly set chromedriver path
      const service = new chrome.ServiceBuilder("C:\\Users\\Acer\\Desktop\\mern-qa\\node_modules\\chromedriver\\lib\\chromedriver\\chromedriver.exe");
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

      console.log("✅ WebDriver started successfully.");
    } catch (error) {
      console.error("❌ Error in before() hook:", error);
      throw error;
    }
  });

  after(async () => {
    if (driver) {
      console.log("Closing WebDriver...");
      await driver.quit();
    }
  });

  it("logs in with valid credentials", async () => {
    console.log("Navigating to login page...");
    await driver.get("http://localhost:3000/login.html");

    await driver.findElement(By.id("username")).sendKeys("alice");
    await driver.findElement(By.id("password")).sendKeys("secret");
    console.log("Clicking login button...");
    await driver.findElement(By.id("loginBtn")).click();

    console.log("Waiting for welcome message...");
    await driver.sleep(2000); // Increased delay to 2 seconds
    const welcomeMsgElement = await driver.wait(
      until.elementLocated(By.id("welcomeMsg")),
      15000 // Increased to 15 seconds
    );
    const msg = await welcomeMsgElement.getText();
    console.log("Captured welcome message text:", msg);
    console.log("Captured welcome message HTML:", await welcomeMsgElement.getAttribute("innerHTML")); // Debug log
    console.log("Page source after login:", await driver.getPageSource().then(s => s.substring(0, 500))); // Partial page source
    expect(msg).to.include("Welcome, alice!");
  });
});
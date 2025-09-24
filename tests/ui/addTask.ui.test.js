const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");

describe("Tasks page", function () {
  this.timeout(60000); // longer timeout for CI
  let driver;

  before(async () => {
    console.log("Starting WebDriver...");
    const options = new chrome.Options()
      .addArguments("--no-sandbox", "--disable-dev-shm-usage");

    // On Windows, point to your Chrome install
    options.setChromeBinaryPath("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");

    // On GitHub Actions, CHROME_PATH will override this
    if (process.env.CHROME_PATH) options.setChromeBinaryPath(process.env.CHROME_PATH);

    // Explicitly set chromedriver path
    const service = new chrome.ServiceBuilder("C:\\Users\\Acer\\Desktop\\mern-qa\\node_modules\\chromedriver\\lib\\chromedriver\\chromedriver.exe");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    console.log("WebDriver started successfully.");
  });

  after(async () => {
    if (driver) {
      console.log("Closing WebDriver...");
      await driver.quit();
    }
  });

  it("adds a task and shows it in the list", async () => {
    console.log("Navigating to tasks page...");
    await driver.get("http://localhost:3000/tasks.html");

    console.log("Finding task input...");
    const input = await driver.findElement(By.id("taskInput"));
    await input.sendKeys("Study QA");

    console.log("Clicking add button...");
    await driver.findElement(By.id("addBtn")).click();

    console.log("Waiting for task in list...");
    await driver.sleep(2000); // Increased delay to 2 seconds
    const tasksList = await driver.findElement(By.id("tasks")); // Verify tasks list exists
    console.log("Tasks list found, checking children...");
    const lis = await tasksList.findElements(By.css("li")); // Get all li elements
    console.log("Number of li elements:", lis.length);
    if (lis.length > 0) {
      const firstLi = await driver.wait(
        until.elementLocated(By.css("#tasks li:first-child")),
        15000 // 15 seconds
      );
      const text = await firstLi.getText();
      console.log("Captured task text:", text); // Debug log
      expect(text).to.equal("Study QA");
    } else {
      console.log("No li elements found in #tasks");
      throw new Error("No task elements found after adding task");
    }
  });
});
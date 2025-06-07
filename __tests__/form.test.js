/**
 * @jest-environment node
 */
import puppeteer from "puppeteer";

describe("Basic user flow for Feedback Form", () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch Puppeteer in headless mode
    // The `--no-sandbox` and `--disable-setuid-sandbox` flags are needed for CI environments
    // like GitHub Actions, where Chrome's sandbox cannot run due to security restrictions.
    // Disabling the sandbox is okay in this testing environment because it's isolated.
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.goto("http://127.0.0.1:5501/source/form.html"); // your actual form page URL
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Check that all form fields exist", async () => {
    console.log("Checking for all form elements...");

    const nameField = await page.$("#name");
    const emailField = await page.$("#email");
    const feedbackField = await page.$("#feedback");
    const ratingField = await page.$("#rating");

    expect(nameField).not.toBeNull();
    expect(emailField).not.toBeNull();
    expect(feedbackField).not.toBeNull();
    expect(ratingField).not.toBeNull();
  });

  it("Fill out form and submit", async () => {
    console.log("Filling out the form...");

    await page.type("#name", "Melissa");
    await page.type("#email", "melissa@example.com");
    await page.type("#feedback", "This site is awesome!");
    await page.select("#rating", "good");

    // Listen for the alert
    page.once("dialog", async (dialog) => {
      const message = dialog.message();
      expect(message).toContain("Thank you for your feedback!");
      await dialog.dismiss();
    });

    await page.click("button[type=submit]");
  });
});

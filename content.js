chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generateUnitTests") {
    let report = [];
    let testCode = [];

    // Jest & Puppeteer Imports
    testCode.push(`
const puppeteer = require('puppeteer');

describe('UI Tests for Webpage', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('${window.location.href}');
  });

  afterAll(async () => {
    await browser.close();
  });
`);

    // ✅ Check if the navbar exists
    let navbar = document.querySelector("nav");
    report.push(navbar ? "✅ Test: Navbar should exist. ✔️" : "❌ Test: Navbar should exist. ❌");
    testCode.push(`
  test('Navbar should exist', async () => {
    const navbar = await page.$('nav');
    expect(navbar).not.toBeNull();
  });
`);

    // ✅ Count buttons
    let buttons = document.querySelectorAll("button");
    report.push(`✅ Test: The page should have ${buttons.length} buttons.`);
    testCode.push(`
  test('Should have ${buttons.length} buttons', async () => {
    const buttons = await page.$$('button');
    expect(buttons.length).toBe(${buttons.length});
  });
`);

    // ✅ Check if images have alt attributes
    let images = document.querySelectorAll("img");
    let allImagesHaveAlt = Array.from(images).every(img => img.hasAttribute("alt"));
    report.push(allImagesHaveAlt ? "✅ Test: All images should have alt attributes. ✔️" : "❌ Test: Some images are missing alt attributes. ❌");
    testCode.push(`
  test('All images should have alt attributes', async () => {
    const images = await page.$$eval('img', imgs => imgs.every(img => img.hasAttribute('alt')));
    expect(images).toBe(true);
  });
`);

    // ✅ Detect Modals
    let modals = document.querySelectorAll(".modal, .popup, [role='dialog']");
    if (modals.length > 0) {
      report.push(`✅ Test: Detected ${modals.length} modal(s) on the page.`);
      testCode.push(`
  test('Modals should be present', async () => {
    const modals = await page.$$('.modal, .popup, [role="dialog"]');
    expect(modals.length).toBeGreaterThan(0);
  });
`);
    } else {
      report.push("❌ Test: No modals detected on the page.");
    }

    // ✅ Detect Carousels
    let carousels = document.querySelectorAll(".carousel, .slider, .slick-slider, .swiper-container");
    if (carousels.length > 0) {
      report.push(`✅ Test: Detected ${carousels.length} carousel(s) on the page.`);
      testCode.push(`
  test('Carousels should be present', async () => {
    const carousels = await page.$$('.carousel, .slider, .slick-slider, .swiper-container');
    expect(carousels.length).toBeGreaterThan(0);
  });
`);
    } else {
      report.push("❌ Test: No carousels detected.");
    }

    // Close Jest Test Block
    testCode.push("});");

    sendResponse({ report: report.join("\n"), testCode: testCode.join("\n") });
  }
});

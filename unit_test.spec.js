
const puppeteer = require('puppeteer');

describe('UI Tests for Webpage', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('https://medium.com/data-engineer-things/a-non-beginner-data-engineering-roadmap-2025-edition-2b39d865dd0b');
  });

  afterAll(async () => {
    await browser.close();
  });


  test('Navbar should exist', async () => {
    const navbar = await page.$('nav');
    expect(navbar).not.toBeNull();
  });


  test('Should have 61 buttons', async () => {
    const buttons = await page.$$('button');
    expect(buttons.length).toBe(61);
  });


  test('All images should have alt attributes', async () => {
    const images = await page.$$eval('img', imgs => imgs.every(img => img.hasAttribute('alt')));
    expect(images).toBe(true);
  });


  test('Modals should be present', async () => {
    const modals = await page.$$('.modal, .popup, [role="dialog"]');
    expect(modals.length).toBeGreaterThan(0);
  });

});
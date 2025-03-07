import { Page } from "@playwright/test";
import { expect, test } from "../fixtures/performance-fixture";
import { beforeAll } from "../utils/hooks";
import baseUrl from "../utils/baseUrl";
import MainPage from "../pages/main-page";
import data from "../utils/data";

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await beforeAll(page, baseUrl.url)
    mainPage = new MainPage(page);
});

let mainPage: MainPage;

test.describe('Performance', () => {
    test.only('should print performance for navigation to baseUrl', async () => {
        await page.goto(baseUrl.url);
    });
});
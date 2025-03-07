import test, { expect, Page } from "@playwright/test";
import { beforeAll } from "../utils/hooks";
import MainPage from "../pages/main-page";
import data from "../utils/data";
import baseUrl from "../utils/baseUrl";

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await beforeAll(page, baseUrl.url)
    mainPage = new MainPage(page);
});

let mainPage: MainPage;



test.describe('Search', () => {
    test.beforeEach(async () => {
        await page.goto(baseUrl.url);
    });

    test('should search for location', async () => {
        await mainPage.searchFor(data.location);
        expect(await page.title()).toBe(`Search for accommodations in ${data.location} - Google hotels`)
        const results = await mainPage.resultsComponent.getNumberOfResults();
        expect(results, `No results were found for ${data.location}`).toBeGreaterThan(0);
    });

    test('should search for non-existing location', async () => {
        await mainPage.searchFor(data.nonExistingLocation);
        expect(await mainPage.resultsComponent.noResultsMessageIsDisplayed(), `Results were found for ${data.nonExistingLocation}`).toBe(true);
    });

    test('should search for specific hotel', async () => {
        const overviewPage = await mainPage.searchFor(data.specificLocation, true);
        const title = await overviewPage!.getOverviewTitle();
        expect(title, `The title of the hotel opened is different than ${data.specificLocation}`).toBe(data.specificLocation);
    });
});
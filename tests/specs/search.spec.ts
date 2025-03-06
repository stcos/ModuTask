import test, { expect, Page } from "@playwright/test";
import { acceptGoogleConsent } from "../utils/hooks";
import MainPage from "../pages/main-page";
import data from "../utils/data";
import baseUrl from "../utils/baseUrl";

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await acceptGoogleConsent(page, baseUrl.url)
    mainPage = new MainPage(page);
});

let mainPage: MainPage;

test.beforeEach(async () => {
    await page.goto(baseUrl.url);
});

test.describe('Search', () => {
    
    
    test('should search for location', async () => {
        await mainPage.searchFor(data.location);
        expect(await page.title()).toBe(`Search for accommodations in ${data.location} - Google hotels`)
        const results = await mainPage.resultsComponent.getNumberOfResults();
        expect(results).toBeGreaterThan(0);
    });

    test('should search for non-existing location', async () => {
        await mainPage.searchFor(data.nonExistingLocation);
        expect(await mainPage.resultsComponent.noResultsMessageIsDisplayed()).toBe(true);
    });

    test('should search for specific hotel', async () => {
        await mainPage.searchFor(data.specificLocation);
        const title = await mainPage.overviewComponent.getOverviewTitle();
        expect(title).toBe(data.specificLocation);
    });

});
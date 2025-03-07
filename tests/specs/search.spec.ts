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
        console.log('Searching for:', data.location)
        await mainPage.searchFor(data.location);
        expect(await page.title()).toBe(`Search for accommodations in ${data.location} - Google hotels`)
        const results = await mainPage.resultsComponent.getNumberOfResults();
        console.log('Checking if search option has results')
        expect(results, `No results were found for ${data.location}`).toBeGreaterThan(0);
    });

    test('should search for non-existing location', async () => {
        console.log('Searching for:', data.nonExistingLocation)
        await mainPage.searchFor(data.nonExistingLocation);
        console.log('Checking that there are no results found for a non-existing location')
        expect(await mainPage.resultsComponent.noResultsMessageIsDisplayed(), `Results were found for ${data.nonExistingLocation}`).toBe(true);
    });

    test('should search for specific hotel', async () => {
        console.log('Searching for specific hotel', data.specificLocation);
        const overviewPage = await mainPage.searchFor(data.specificLocation, true);
        const title = await overviewPage!.getOverviewTitle();
        console.log('Checking if the page is redirected to the overview page of the hotel');
        expect(title, `The title of the hotel opened is different than ${data.specificLocation}`).toBe(data.specificLocation);
    });
});
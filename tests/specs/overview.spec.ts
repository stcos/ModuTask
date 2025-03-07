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

    /**
     * Test verifies that options are available for selected number of guests and the number of guests is retained
     */
    test('should find hotel for 6 adults', async () => {
        await mainPage.searchFor(data.location);
        await mainPage.selectNumberOfGuests({adults: 4, children: 2});
        const overviewPage = await mainPage.resultsComponent.viewPricesForFirstHotel();
        expect(await overviewPage.isTabActive('prices')).toBe(true);

        const options = await overviewPage.pricesPanel.getNumberOfOptions();
        expect(options).toBeGreaterThan(0);

        const numberOfGuests = await overviewPage.pricesPanel.getNumberOfGuests();
        expect(numberOfGuests, `Number of guests ${numberOfGuests} is different than the expected number: 6`).toBe(6);
    });
});
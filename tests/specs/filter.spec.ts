import test, { expect, Page } from "@playwright/test";
import baseUrl from "../utils/baseUrl";
import MainPage from "../pages/main-page";
import data from "../utils/data";
import { acceptGoogleConsent } from "../utils/hooks";
import { SortType } from "../utils/sortType";
import { isNumberArraySorted } from "../utils/tsUtils";

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await acceptGoogleConsent(page, baseUrl.url)
})

test.describe('Filter', () => {
    
    let mainPage: MainPage;

    test.beforeEach(async () => {
        await page.goto(baseUrl.url);
        mainPage = new MainPage(page);
        await mainPage.searchFor(data.location)
    })
   
    test(`should sort by Lowest price`, async () => {
        console.log('Started test')
        let filterComponent = await mainPage.openFilterPanel();
        await filterComponent.sortBy(SortType.LOWEST_PRICE);
        await filterComponent.closeFilterPanel();
        await mainPage.waitForSearchToFinish();
        const prices = await mainPage.resultsComponent.getPrices();
        const isSorted = isNumberArraySorted(prices) 
        expect(isSorted).toBe(true)
    })

    // test(`should sort by Highest Rating`, async () => {
    //     console.log('Started test')
    //     let filterComponent = await mainPage.openFilterPanel();
    //     await filterComponent.sortBy(SortType.LOWEST_PRICE);
    //     await filterComponent.closeFilterPanel();
    //     await mainPage.waitForSearchToFinish();
       
    // })
    
})
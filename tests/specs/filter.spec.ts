import test, { expect, Page } from "@playwright/test";
import baseUrl from "../utils/baseUrl";
import MainPage from "../pages/main-page";
import data from "../utils/data";
import { beforeAll } from "../utils/hooks";
import { SortType } from "../utils/sortType";
import { isNumberArraySortedAscending, isNumberArraySortedDescending } from "../utils/tsUtils";
import { Anemities } from "../utils/anemities";

let page: Page;
let mainPage: MainPage;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await beforeAll(page, baseUrl.url)
    mainPage = new MainPage(page);
})

test.describe('Filter', () => {
    test.beforeEach(async () => {
        await page.goto(baseUrl.url);
        await mainPage.searchFor(data.location)
    })
   
    test(`should sort by Lowest price`, async () => {
        console.log('Started test')
        await mainPage.sortBy(SortType.LOWEST_PRICE);
        const prices = await mainPage.resultsComponent.getPrices();
        const isSortedAscending = isNumberArraySortedAscending(prices) 
        expect(isSortedAscending, 'The hotel prices are not sorted by price').toBe(true)
    })

    test(`should sort by Most Reviews`, async () => {
        console.log('Started test')
        await mainPage.sortBy(SortType.MOST_REVIEWED);
        const reviews = await mainPage.resultsComponent.getHotelsReviews();
        const isSortedDescending = isNumberArraySortedDescending(reviews);
        expect(isSortedDescending, 'The hotel results are not sorted by most reviews').toBe(true)
    })

    test(`should filter by Pet-Friendly anemity`, async () => {
        console.log('Started test')
        await mainPage.filterBy({ anemities: [Anemities.BAR]});
        const hotelAmenities = await mainPage.resultsComponent.getHotelsData();
        const hasPetFriendly = hotelAmenities.every(amenity => amenity.amenities!.includes(Anemities.BAR));
        expect(hasPetFriendly, 'Not all hotels have the pet-friendly anemity').toBe(true)
    })
})
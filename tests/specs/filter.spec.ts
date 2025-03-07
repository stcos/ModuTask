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
        console.log(`Searching for hotel in ${data.location}`)
        await mainPage.searchFor(data.location)
    })
   
    test(`should sort by Lowest price`, async () => {
        console.log('Sorting by lowest price')
        await mainPage.sortBy(SortType.LOWEST_PRICE);
        console.log('Getting prices for hotels')
        const prices = await mainPage.resultsComponent.getPrices();
        const isSortedAscending = isNumberArraySortedAscending(prices) 
        console.log('Verifying that the prices are in ascending order')
        expect(isSortedAscending, 'The hotel prices are not sorted by price').toBe(true)
    })

    test(`should sort by Most Reviews`, async () => {
        console.log('Sorting by most reviewd')
        await mainPage.sortBy(SortType.MOST_REVIEWED);
        console.log('Getting number of reviews')
        const reviews = await mainPage.resultsComponent.getHotelsReviews();
        const isSortedDescending = isNumberArraySortedDescending(reviews);
        console.log('Verifying that the review are in descending order')
        expect(isSortedDescending, 'The hotel results are not sorted by most reviews').toBe(true)
    })

    test(`should filter by Pet-Friendly anemity`, async () => {
        console.log('Filtering by anemity Bar')
        await mainPage.filterBy({ anemities: [Anemities.BAR]});
        console.log('Getting all anemities for the hotels displayed')
        const hotelAmenities = await mainPage.resultsComponent.getHotelsData();
        const hasPetFriendly = hotelAmenities.every(amenity => amenity.amenities!.includes(Anemities.BAR));
        console.log('Checking if all hotels contain the Bar anemity')
        expect(hasPetFriendly, 'Not all hotels have the pet-friendly anemity').toBe(true)
    })
})
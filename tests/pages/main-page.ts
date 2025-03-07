import { expect, Locator, Page } from "@playwright/test";
import FilterComponent from "./components/filter-component";
import ResultsComponent from "./components/results-component";
import { OverviewPage } from "./overview-page";
import { SortType } from "../utils/sortType";
import { Anemities } from "../utils/anemities";

class MainPage {
    readonly resultsComponent: ResultsComponent;
    readonly searchInputButton: Locator;
    readonly searchInputField: Locator;
    readonly filterButton: Locator;
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        // First input must be clicked to focus the input field
        this.searchInputButton = page.locator('input[aria-label="Search for places, hotels and more"]').first();
        // Second input must be filled with the search text
        this.searchInputField = page.locator('[role="dialog"] input[aria-label="Search for places, hotels and more"]');
        this.filterButton = page.locator('button[aria-label="All filters"]');
        this.resultsComponent = new ResultsComponent(page);
    }

    /**
     * Search for criteria. If it's a single result, return the OverviewPage
     * @param text - text to search for
     * @param isSingleResult - Expected result for a single hotel
     * @returns 
     */
    public async searchFor(text: string, isSingleResult = false) {
        await this.searchInputButton.click();
        // Clear the input field before typing if the location is active in the browser
        await this.searchInputField.fill('');
        await this.searchInputField.fill(text);
        await this.searchInputField.press('Enter');
        await this.waitForSearchToFinish();
        if(isSingleResult) {
            return new OverviewPage(this.page)
        }
    }

    
    readonly loadingCircleLocator = '[aria-label="Loading results"] circle:visible';
    /**
     * Wait for the loading state to finish
     */
    public async waitForSearchToFinish() {
        await this.page.waitForSelector(this.loadingCircleLocator, {timeout: 2000}).catch(() => {
            console.log('Loading state did not appear or page already loaded, assuming search is finished');
            return;
        });
        const loadingStateCircles = await this.page.locator(this.loadingCircleLocator).all();
        await Promise.all((loadingStateCircles).map(locator => locator.waitFor({ state: 'hidden' })));
    }

    /**
     * Opens the filter panel from the main page
     * @returns 
     */
    public async openFilterPanel() {
        await this.filterButton.click();
        return new FilterComponent(this.page);
    }

    public async sortBy(sortType: SortType) {
        let filterComponent = await this.openFilterPanel();
        await filterComponent.sortBy(sortType);
        await filterComponent.closeFilterPanel();
        // closing filter panel by pressing Esc due to the fact that it does not close when interacting with it for the first time
        await this.waitForSearchToFinish();
    }

    // TODO: add all filter options and create filter object
    public async filterBy(filters:
        { anemities?: Anemities[], 
        rating?: 'Any' | 3.5 | 4.0 | 4.5,
        type?: string[],
        hotelClass?: '2-star' | '3-star' | '4-star' | '5-star',
        }) {
        let filterComponent = await this.openFilterPanel();
        await filterComponent.filterBy(filters);
        await filterComponent.closeFilterPanel();
        // closing filter panel by pressing Esc due to the fact that it does not close when interacting with it for the first time
        await this.waitForSearchToFinish();
    }

    /**
     * Selects the number of guests
     * @param guests - Desired number of guests
     */
    public async selectNumberOfGuests(guests: {adults: number, children?: number}) {
        if((guests.adults + (guests.children ? guests.children : 0)) > 6) {
            throw new Error('Maximum number of guests is 6');
        }
        await this.page.locator('[aria-label^="Number of travelers"]').click();
        const currentAdults = await this.page.locator('[aria-label="Adults"] >div >span:nth-of-type(2) > span').first().textContent();
        const adultsToBeAdded = guests.adults - parseInt(currentAdults!);
        const currentChildren = await this.page.locator('[aria-label="Children"] >div >span:nth-of-type(2) > span').first().textContent();
        let childrenToBeAdded = 0
        if(guests.children) {
            childrenToBeAdded = guests.children ? guests.children - parseInt(currentChildren!) : 0;
        }
        if(adultsToBeAdded + childrenToBeAdded + parseInt(currentAdults!) + parseInt(currentChildren!) > 6) {
            throw new Error('Maximum number of guests is 6');
        }
        if (adultsToBeAdded > 0) {
            await this.page.locator('[aria-label="Adults"] >div >span:nth-of-type(3)').first().click({clickCount: adultsToBeAdded});
        }
        if (childrenToBeAdded > 0) {
            await this.page.locator('[aria-label="Children"] >div >span:nth-of-type(3)').first().click({clickCount: childrenToBeAdded});
        }
        await this.page.locator('//*[@role = "dialog"]//button[span[text() = "Done"]]').first().click();
        await this.waitForSearchToFinish();
    }
}

export default MainPage;
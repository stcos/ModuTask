import { expect, Locator, Page } from "@playwright/test";
import FilterComponent from "./components/filter-component";
import ResultsComponent from "./components/results-component";
import { OverviewComponent } from "./components/overview-component";

class MainPage {
    readonly resultsComponent: ResultsComponent;
    readonly overviewComponent: OverviewComponent;
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
        this.overviewComponent = new OverviewComponent(page);
    }

    public async searchFor(text: string) {
        await this.searchInputButton.click();
        // Clear the input field before typing if the location is active in the browser
        await this.searchInputField.fill('');
        await this.searchInputField.fill(text);
        await this.searchInputField.press('Enter');
        await this.waitForSearchToFinish();
    }

    public async waitForSearchToFinish() {
        await this.page.waitForSelector('[aria-label="Loading results"] circle:visible', {timeout: 2000});
        const loadingStateCircles = await this.page.locator('[aria-label="Loading results"] circle:visible').all();
        await Promise.all((loadingStateCircles).map(locator => locator.waitFor({ state: 'hidden' })));
    }

    public async openFilterPanel() {
        await this.filterButton.click();
        return new FilterComponent(this.page);
    }
}

export default MainPage;
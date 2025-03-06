import { Page } from "@playwright/test";

class ResultsComponent {

    readonly noResultsMessage = 'No properties exactly match your search';
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async getNumberOfResults() {
        const results = await this.page.locator('//h1/div[contains(text(), "results")]').textContent();
        if (!results) {
            return 0;
        }
        const numberOfResults = results.split(/\s|&nbsp;/);

        return numberOfResults ? parseInt(numberOfResults[numberOfResults.length - 2]) : 0;
    }

    public async getPrices() {
        const priceTagElements = await this.page.locator('//*[@data-tab="overview"]//*[contains(@aria-label, "Prices starting from")]').all();
        const prices = await Promise.all(priceTagElements.map(async (priceTag) => {
            const price = await priceTag.getAttribute('aria-label');
            if (!price) {
                return 0;
            }
            const locationPrice = price.split(',')[0].split(/\s|&nbsp;/)
            const priceValue = locationPrice[locationPrice.length - 1];
            return parseInt(priceValue);
        }));
        return prices;
    }

    public async noResultsMessageIsDisplayed() {
        return await this.page.getByText(this.noResultsMessage).isVisible();
    }

}

export default ResultsComponent;
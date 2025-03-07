import { Page } from "@playwright/test";
import { PricesPanel } from "./prices-panel";
import OverviewPanel from "./overview-panel";

/**
 * Overview of the hotel page
 */
export class OverviewPage {
    readonly page: Page;
    readonly pricesPanel: PricesPanel;
    readonly overviewPanel: OverviewPanel;

    constructor(page: Page) {
        this.page = page;
        //TODO: Initialize the Panels when elements are available and visible
        this.pricesPanel = new PricesPanel(page.locator('#prices[role = "tabpanel"]'));
        this.overviewPanel = new OverviewPanel(page.locator('#overview[role = "tabpanel"] '));
    }

    public async getOverviewTitle() {
        return await this.page.locator('h1[role="heading"]').textContent();
    }

    public getTabButton(tabName: 'overview' | 'prices' | 'reviews' | 'photos' | 'details') {
        return this.page.locator(`[aria-controls = '${tabName}']`);
    }

    public async isTabActive(tabName: 'overview' | 'prices' | 'reviews' | 'photos' | 'details') {  
        const isSelected = await (this.getTabButton(tabName)).getAttribute('aria-selected') === 'true';
        return isSelected;
    }

    public async openTab(tabName: 'overview' | 'prices' | 'reviews' | 'photos' | 'details') {
        await this.getTabButton(tabName).click();
    }
}
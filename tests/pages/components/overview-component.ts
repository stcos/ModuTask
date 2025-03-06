import { Page } from "@playwright/test";

export class OverviewComponent {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async getOverviewTitle() {
        return await this.page.locator('h1[role="heading"]').textContent();
    }
}
import { Locator, Page } from "@playwright/test";

class ConsentPage {
    readonly page: Page;
    readonly acceptButton: Locator;

    constructor(page: Page) {
        this.page = page
        this.acceptButton = page.locator('button[aria-label="Accept all"]:visible').first()
    }

    public async acceptAll() {
        await this.acceptButton.click()
    }
}

export default ConsentPage;
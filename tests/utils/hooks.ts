import { Page } from "@playwright/test";
import ConsentPage from "../pages/consent-page";

// This function should be called before all tests
export const beforeAll = async (page: Page, url: string) => {
    await page.goto(url);
    const consentPage = new ConsentPage(page)
    await consentPage.acceptAll();
    await page.waitForURL(`${url}**`)
}


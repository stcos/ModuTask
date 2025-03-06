import { Page } from "@playwright/test";
import MainPage from "../main-page";
import { SortType } from "../../utils/sortType";

class FilterComponent {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async sortBy(sortType: SortType) {
        await this.page.click(`//*[@aria-label="Sort results"]//*[text() = '${sortType}']`)
    }

    public async closeFilterPanel() {
        await this.page.keyboard.press('Escape');
    }
}

export default FilterComponent;
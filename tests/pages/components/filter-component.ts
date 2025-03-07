import { Page } from "@playwright/test";
import { SortType } from "../../utils/sortType";
import { Anemities } from "../../utils/anemities";

class FilterComponent {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Sorts the results by the given sort type
     * @param sortType
     */
    public async sortBy(sortType: SortType) {
        await this.page.click(`//*[@aria-label="Sort results"]//*[text() = '${sortType}']`)
    }

    // TODO: add all filter options and create filter object
    /**
     * 
     * @param filters 
     */
    public async filterBy(filters:
        { anemities?: Anemities[], 
        rating?: 'Any' | 3.5 | 4.0 | 4.5,
        type?: string[],
        hotelClass?: '2-star' | '3-star' | '4-star' | '5-star',
        }) {
        if(filters.anemities) {
            for (const anemity of filters.anemities) {
                await this.page.click(`[aria-label="${anemity}"]`)
            }
        }   
        if(filters.rating) {
            if(filters.rating === 'Any') {
                await this.page.click("//h2[text() = 'Guest rating']/following-sibling::*//*[text() = 'Any']")
            } else {
                await this.page.click(`[aria-label^="${filters.rating}"]`);
            }
            
        }
        if(filters.type) {
            for (const type of filters.type) {
                await this.page.getByText(type).click();
            }
        }
        if(filters.hotelClass) {
            await this.page.click(`[aria-label^="${filters.hotelClass}"]`)
        }
    }

    public async closeFilterPanel() {
        await this.page.keyboard.press('Escape');
    }
}

export default FilterComponent;
import { Locator } from "@playwright/test";
import BasePanel from "./base-panel";

/**
 * Prices panel component
 */
export class PricesPanel extends BasePanel {
    constructor(panel: Locator) {
        super(panel);
    }

    public async getNumberOfOptions() {
        await this.waitForPanelToLoad();
        return (await this.panel.locator(`//*[text() = 'All options']/../../../following-sibling::div/span/div`).all()).length;
    }

    public async getNumberOfGuests() {
        await this.waitForPanelToLoad();
        const guestsLabel = await this.panel.locator('[aria-label^="Number of travelers. Current number of travelers"]').getAttribute('aria-label');
        if (!guestsLabel) {
            return 0;
        }

        const splitGuestsLabel = guestsLabel.split(' ');
        return parseInt(splitGuestsLabel[splitGuestsLabel.length - 1]);
    }
}

export default PricesPanel;
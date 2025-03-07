import { Locator } from "@playwright/test";
import BasePanel from "./base-panel";

export class OverviewPanel extends BasePanel{
    constructor(panel: Locator) {
        super(panel);
    }

    public async clickCheckAvailability() {
        await this.waitForPanelToLoad();
        await this.panel.getByText('Check availability').click();
    }
}

export default OverviewPanel;
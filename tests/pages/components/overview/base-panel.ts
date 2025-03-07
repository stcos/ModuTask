import { Locator } from "@playwright/test";

/**
 * Base panel component that will extend all overview page panels
 */
export class BasePanel {
    readonly panel: Locator;
    constructor(panel: Locator) {
        this.panel = panel;
    }

    public async waitForPanelToLoad() {
        await this.panel.locator('[role="progressbar"][aria-hidden="false"]').waitFor({ state: 'visible', timeout: 2000 })
            .catch(() => { console.log('Page is loaded') });
        await this.panel.locator('[role="progressbar"][aria-hidden="true"]').waitFor({ state: 'visible', timeout: 30000 })
    }
}
export default BasePanel;
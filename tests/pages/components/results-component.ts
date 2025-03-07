import { Locator, Page } from "@playwright/test";
import { Hotel } from "../../utils/hotel";
import { OverviewPage } from "../overview-page";

class ResultsComponent {

    readonly noResultsMessage = 'No properties exactly match your search';
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the number of results displayed on the page
     * @returns 
     */
    public async getNumberOfResults() {
        const results = await this.page.locator('//h1/div[contains(text(), "results")]').textContent();
        if (!results) {
            return 0;
        }
        const numberOfResults = results.split(/\s|&nbsp;/);

        return numberOfResults ? parseInt(numberOfResults[numberOfResults.length - 2]) : 0;
    }

    /**
     * Getting all the prices for the hotels displayed on the page
     */
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

    /**
     * No results message is displayed
     * @returns 
     */
    public async noResultsMessageIsDisplayed() {
        return await this.page.getByText(this.noResultsMessage).isVisible();
    }

    /**
     * Get all the hotels elements displayed on the page
     * @returns 
     */
    public async getHotelsElements() {
        return await this.page.locator('c-wiz > div:has( > a[data-href^="/entity/"]) > div > div > div:not(:has([data-page-visible-elements="false"]))').all();     
    }

    public async viewPricesForFirstHotel() {
        const hotelElements = await this.getHotelsElements();
        await hotelElements[0].scrollIntoViewIfNeeded();
        await this.viewHotelPrices(hotelElements[0]);
        return new OverviewPage(this.page);   
    }

    /**
     * Getting all the hotels data displayed on the page
     * @returns 
     */
    public async getHotels() {
        const hotelElements = await this.getHotelsElements();
        return await Promise.all(hotelElements.map(async (hotelElement) => {
            const name = await this.getHotelName(hotelElement);
            const ratingAndReview = await this.getHotelRatingAndReviews(hotelElement);
            const price = await this.getHotelPrice(hotelElement);
            const amenities = await this.getHotelAmenities(hotelElement);
            const type = await this.getHotelType(hotelElement);
            return { name, rating: ratingAndReview.rating, reviews: ratingAndReview.reviews, price, amenities, type } as Hotel;
        }));
    }

    /**
     * Created duplicate method of getHotels() to get all the data for each hotel in one go
     * Method is faster than getting each element separately
     * @returns Array of hotels with their name, rating, reviews, price, amenities and type
     */
    public async getHotelsData() {
        const hotelElements = this.page.locator('c-wiz > div:has( > a[data-href^="/entity/"]) > div > div > div:not(:has([data-page-visible-elements="false"]))');
    
        const hotelsData = await hotelElements.evaluateAll((elements) => {
            return elements.map((hotel) => {
                // Extract name
                const name = hotel.querySelector('h2')?.textContent?.trim() || '';
    

                // Extract rating and reviews
                const ratingElement = hotel.querySelector('[aria-label$="reviews"]');
                let rating = 0;
                let reviews = 0;
                if (ratingElement) {
                    const ratingText = ratingElement.getAttribute('aria-label') || '';
                    const parts = ratingText.split(' ');
                    rating = parseFloat(parts[0]);
                    reviews = parseInt(parts[parts.length - 2].replace(',', ''), 10);
                }
    
                // Extract price
                const priceElement = hotel.querySelector('[data-tab="overview"] [aria-label *= "Prices starting from"]');
                let price = 0;
                if (priceElement) {
                    const priceText = priceElement.getAttribute('aria-label') || '';
                    const locationPrice = priceText.split(',')[0].split(/\s|&nbsp;/);
                    price = parseInt(locationPrice[locationPrice.length - 1]);
                }
    
                // Extract amenities
                const amenityElements = Array.from(hotel.querySelectorAll('[role="document"] + div > li > span:not(:has(svg))'));
                const amenities = amenityElements.map((amenity) => amenity.textContent?.trim() || '');
    
                // Extract type
                const typeElement = hotel.querySelector('[role="document"] + div > div > span:not(:has(svg))');
                const type = typeElement?.textContent?.trim() || '';
    
                return {
                    name,
                    rating,
                    reviews,
                    price,
                    amenities,
                    type,
                } as Hotel;
            });
        });
    
        return hotelsData;
}

    /**
     * Getting review count for each hotel.
     * Method is slow due to the fact that we have to check if the element exists for each hotel element
     * @returns Array of reviews for each hotel
     */
    public async getHotelsReviews() {
        const hotelElements = await this.getHotelsElements();
        return await Promise.all(hotelElements.map(async (hotelElement) => {
            const ratingsAndReviews = await this.getHotelRatingAndReviews(hotelElement);
            return ratingsAndReviews.reviews;
        }));
    }

    /**
     * Method is slow due to the number of elements that need to be checked for each hotel
     * @returns Array of array of amenities for each hotel
     */
    public async getHotelsAnemities() {
        const hotelElements = await this.getHotelsElements();
        return await Promise.all(hotelElements.map(async (hotelElement) => {
            const amenities = await this.getHotelAmenities(hotelElement);
            return amenities;
        }));
    }

    /**
     * Get the price for the hotel based on the hotel locator
     * @param hotelLocator 
     * @returns 
     */
    private async getHotelPrice(hotelLocator: Locator) {
        const price = await hotelLocator.locator('[data-tab="overview"] [aria-label *= "Prices starting from"]').getAttribute('aria-label');
        const locationPrice = price!.split(',')[0].split(/\s|&nbsp;/)
        const priceValue = locationPrice[locationPrice.length - 1];
        return parseInt(priceValue);
    }

    /**
     * Get hotel name based on the hotel locator
     * @param hotelLocator 
     * @returns 
     */
    private async getHotelName(hotelLocator: Locator) {
        return await hotelLocator.locator('h2').textContent();
    }

    /**
     * Get hotel rating and reviews based on the hotel locator
     * @param hotelLocator 
     * @returns 
     */
    private async getHotelRatingAndReviews(hotelLocator: Locator): Promise<{rating: number, reviews: number}> {
        const ratingElement = hotelLocator.locator('[aria-label$="reviews"]');
        if (!await ratingElement.isVisible({timeout: 50})) {
            return { rating: 0, reviews: 0 };
        }
        const rating = await ratingElement.getAttribute('aria-label');
        if(!rating) {
            return { rating: 0, reviews: 0 };
        }
        const parts = rating.split(' ');
        const ratingValue = parts[0];
        const reviews = parts[parts.length - 2];
        return {rating: parseFloat(ratingValue), reviews: parseInt(reviews.replace(',', ''))};
    }

    /**
     * Get hotel amenities based on the hotel locator
     * @param hotelLocator 
     * @returns 
     */
    private async getHotelAmenities(hotelLocator: Locator) {
        const anemities = await hotelLocator.locator('[role="document"] + div > li > span:not(:has(svg))').all();
        if(anemities.length === 0) {
            return [];
        }
        return await Promise.all(anemities.map(async (amenity) => {
            return await amenity.textContent();
        }))
    }

    /**
     * Get hotel type based on the hotel locator
     * @param hotelLocator 
     * @returns 
     */
    private async getHotelType(hotelLocator: Locator) {
        const typeLocator = hotelLocator.locator('[role="document"] + div > div > span:not(:has(svg))');
        if (!await typeLocator.isVisible({timeout: 50})) {
            return '';
        }
        return await hotelLocator.locator('[role="document"] + div > div > span:not(:has(svg))').textContent();
    }

    /**
     * Click view prices button for the hotel
     * @param hotelLocator 
     */
    private async viewHotelPrices(hotelLocator: Locator) {
        await hotelLocator.getByText('View prices').click();
    }
}

export default ResultsComponent;
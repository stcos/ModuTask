import { Anemities } from "./anemities";

export interface Hotel {
    name: string;
    type?: string;
    rating?: number;
    price: number;
    reviews?: number;
    amenities?: Anemities[];
}
import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class Band {
    constructor(
        public id: string,
        public name: string,
        public foundationYear: number,
        public members: string,
        public description: string) { }
}

@Injectable({
    providedIn: 'root'
})
export class BandAdapter implements Adapter<Band> {

    constructor() { }

    back(band: Band): any {
        return {
            id: band.id,
            name: band.name,
            foundation_year: band.foundationYear,
            members: band.members,
            description: band.description
        };
    }

    adapt(band: any): Band {
        return new Band(
            band.id,
            band.name,
            band.foundation_year,
            band.members,
            band.description
        );
    }
}

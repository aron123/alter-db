import { Adapter } from './adapter';
import { Injectable } from '@angular/core';
import { Image, ImageAdapter } from './image.model';

export class Band {
    constructor(
        public id: string,
        public name: string,
        public foundationYear: number,
        public members: string,
        public description: string,
        public images: Image[]) { }
}

@Injectable({
    providedIn: 'root'
})
export class BandAdapter implements Adapter<Band> {

    constructor(public imageAdapter: ImageAdapter) { }

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
            band.description,
            band.images.map(image => this.imageAdapter.adapt(image))
        );
    }
}

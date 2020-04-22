import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class Image {
    constructor(
        public id: number,
        public bandId: number,
        public url: string,
        public thumbnailUrl: string) { }
}

@Injectable({
    providedIn: 'root'
})
export class ImageAdapter implements Adapter<Image> {

    constructor() { }

    back(img: Image): any {
        return {
            id: img.id,
            band_id: img.bandId,
            url: img.url
        };
    }

    adapt(img: any): Image {
        return new Image(
            img.id,
            img.band_id,
            img.url,
            img.thumbnail_url
        );
    }
}

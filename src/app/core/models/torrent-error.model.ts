import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class TorrentError {
    constructor(
        public errcode: string,
        public message: string) { }
}

@Injectable({
    providedIn: 'root'
})
export class TorrentErrorAdapter implements Adapter<TorrentError> {
    adapt(torrentError: any): TorrentError {
        return new TorrentError(torrentError.errcode, torrentError.message);
    }
}

import { Adapter } from './adapter';
import { Injectable } from '@angular/core';
import { TorrentErrorAdapter, TorrentError } from './torrent-error.model';

export class Torrent {
    constructor(
        public id: string,
        public name: string,
        public detailsUrl: string,
        public errors: TorrentError[]) { }
}

@Injectable({
    providedIn: 'root'
})
export class TorrentAdapter implements Adapter<Torrent> {

    constructor(public torrentErrorAdapter: TorrentErrorAdapter) { }

    adapt(torrent: any): Torrent {
        if (!Array.isArray(torrent.errors)) {
            torrent.errors = [];
        }

        return new Torrent(
            torrent.torrent_id,
            torrent.release_name,
            torrent.details_url,
            torrent.errors.map(error => this.torrentErrorAdapter.adapt(error))
        );
    }
}

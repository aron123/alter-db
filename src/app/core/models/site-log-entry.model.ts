import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class SiteLogEntry {
    constructor(
        public id: string,
        public time: Date,
        public nick: string,
        public act: string,
        public originalContent: string,
        public newContent: string) { }
}

@Injectable({
    providedIn: 'root'
})
export class SiteLogEntryAdapter implements Adapter<SiteLogEntry> {

    constructor() { }

    adapt(entry: any): SiteLogEntry {
        return new SiteLogEntry(
            entry.id,
            new Date(entry.time),
            entry.nick,
            entry.act,
            entry.original,
            entry.new
        );
    }
}

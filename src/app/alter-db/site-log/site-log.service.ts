import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteLogEntryAdapter, SiteLogEntry } from 'src/app/core/models/site-log-entry.model';

@Injectable({
  providedIn: 'root'
})
export class SiteLogService {

  constructor(
    public http: HttpClient,
    public adapter: SiteLogEntryAdapter) { }

  async getLast50Entries (): Promise<SiteLogEntry[]> {
    const res = await this.http.get('/api/site-log/').toPromise();
    return res['data'].map(entry => this.adapter.adapt(entry));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteLogEntryAdapter, SiteLogEntry } from 'src/app/core/models/site-log-entry.model';
import { SuccessResponseAdapter, SuccessResponse } from 'src/app/core/models/success-response.model';

@Injectable({
  providedIn: 'root'
})
export class SiteLogService {

  constructor(
    public http: HttpClient,
    public siteLogEntryAdapter: SiteLogEntryAdapter,
    public responseAdapter: SuccessResponseAdapter) { }

  async getLast50Entries(): Promise<SiteLogEntry[]> {
    const res: SuccessResponse = this.responseAdapter.adapt(await this.http.get('/api/site-log/').toPromise());
    return res.data.map(entry => this.siteLogEntryAdapter.adapt(entry));
  }
}

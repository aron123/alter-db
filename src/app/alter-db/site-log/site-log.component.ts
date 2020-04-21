import { Component, OnInit } from '@angular/core';
import { SiteLogService } from './site-log.service';
import { SiteLogEntry } from 'src/app/core/models/site-log-entry.model';

@Component({
  selector: 'app-site-log',
  templateUrl: './site-log.component.html',
  styleUrls: ['./site-log.component.css']
})
export class SiteLogComponent implements OnInit {

  logEntries: SiteLogEntry[];

  constructor(public siteLogService: SiteLogService) { }

  async ngOnInit() {
    this.logEntries = await this.siteLogService.getLast50Entries();
  }

}

import { Component, OnInit } from '@angular/core';
import { BandsService } from '../bands/bands.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(public bandService: BandsService) { }

  ngOnInit(): void {
  }

  startDownload(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  }

  async getDocx() {
    let blob = await this.bandService.exportBandsToDocx();
    blob = blob.slice(0, blob.size, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    this.startDownload(blob, `alter-${Date.now()}.docx`);
  }

  async getJson() {
    let blob = await this.bandService.exportBandsToJson();
    blob = blob.slice(0, blob.size, 'application/json');
    this.startDownload(blob, `alter-${Date.now()}.json`);
  }

}

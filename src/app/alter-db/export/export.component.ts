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

  async getDocx() {
    let blob = await this.bandService.exportBands();
    blob = blob.slice(0, blob.size, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('style', 'display: none');
    document.body.appendChild(a);
    a.href = url;
    a.download = `alter-${Date.now()}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}

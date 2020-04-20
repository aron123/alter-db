import { Component, OnInit } from '@angular/core';
import { BandsService } from './bands.service';
import { Band } from 'src/app/core/models/band.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.component.html',
  styleUrls: ['./bands.component.css']
})
export class BandsComponent implements OnInit {

  bands: Band[];

  constructor(
    public bandsService: BandsService,
    public router: Router) { }

  async ngOnInit() {
    this.bands = await this.bandsService.getAllBands();
  }

  goToEditForm(id: number) {
    this.router.navigate(['bands', 'edit', id.toString()]);
  }

}

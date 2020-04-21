import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BandsService } from '../bands.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-band-form',
  templateUrl: './band-form.component.html',
  styleUrls: ['./band-form.component.css']
})
export class BandFormComponent implements OnInit {

  id: number;
  showForm: boolean = false;
  isNewBand: boolean = true;
  errorMessage: string;
  bandForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    foundationYear: new FormControl(1980),
    members: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    public bandService: BandsService,
    public location: Location,
    public route: ActivatedRoute,
    public router: Router) {
    this.id = this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    if (this.id) {
      this.isNewBand = false;
      const band = await this.bandService.getBandById(this.id);
      this.bandForm.setValue(band);
    }

    this.showForm = true;
  }

  goBack() {
    this.location.back();
  }

  async saveBand() {
    try {
      this.errorMessage = '';
      this.isNewBand
        ? await this.bandService.createBand(this.bandForm.value)
        : await this.bandService.updateBand(this.bandForm.value);
      this.goBack();
    } catch (err) {
      const res = err.error;
      this.errorMessage = res.error;
    }
  }

}

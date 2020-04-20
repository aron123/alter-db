import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BandsService } from '../bands.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-band-edit-form',
  templateUrl: './band-edit-form.component.html',
  styleUrls: ['./band-edit-form.component.css']
})
export class BandEditFormComponent implements OnInit {

  id: number;
  showForm: boolean = false;
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
    const band = await this.bandService.getBandById(this.id);
    this.bandForm.setValue(band);
    this.showForm = true;
  }

  goBack() {
    this.location.back();
  }

  async saveBand() {
    const success = await this.bandService.updateBand(this.bandForm.value);
    // TODO: handle errors

    if (success) {
      this.goBack();
    }
  }

}

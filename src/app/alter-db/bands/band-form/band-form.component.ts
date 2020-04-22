import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BandsService } from '../bands.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ImageService } from '../image.service';
import { Image } from 'src/app/core/models/image.model';

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

  @ViewChild("imageForm", { static: false })
  imageForm: ElementRef;
  @ViewChild("fileUpload", { static: false })
  fileUpload: ElementRef;

  images: Image[] = [];

  bandForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    foundationYear: new FormControl(1980),
    members: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    public bandService: BandsService,
    public imgService: ImageService,
    public location: Location,
    public route: ActivatedRoute,
    public router: Router) {
    this.id = this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    if (this.id) {
      this.isNewBand = false;
      const band = await this.bandService.getBandById(this.id);
      this.images = await this.imgService.getImagesOfBand(this.id);
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

  async uploadImages() {
    const bandId = this.bandForm.get('id').value;
    const files: FileList = this.fileUpload.nativeElement.files;

    // TODO: legyen sorrendhelyes
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const image: Image = await this.imgService.uploadImage(bandId, String(reader.result).split(',')[1]);
          this.images.push(image);
        } catch (err) {
          console.error(err);
        }
      };
      await reader.readAsDataURL(file);
    }

    this.imageForm.nativeElement.reset();
  }

  async deleteImage(img: Image) {
    await this.imgService.deleteImage(img.id);
    const index = this.images.indexOf(img);
    this.images.splice(index, 1);
  }

}

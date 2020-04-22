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
  isUploadInProgress: boolean = false;

  images: Image[] = [];

  bandForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    foundationYear: new FormControl(1980),
    members: new FormControl(''),
    description: new FormControl(''),
    images: new FormControl()
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

  fileToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(String(reader.result));
      };
    });
  }

  async uploadImages() {
    this.isUploadInProgress = true;
    const bandId = this.bandForm.get('id').value;
    const files: FileList = this.fileUpload.nativeElement.files;

    for (const file of Array.from(files)) {
      try {
        const base64 = await this.fileToBase64(file);
        const image: Image = await this.imgService.uploadImage(bandId, base64.split(',')[1]);
        this.images.push(image);
      } catch (err) {
        console.error(err);
        this.isUploadInProgress = false;
      }
    }

    this.imageForm.nativeElement.reset();
    this.isUploadInProgress = false;
  }

  async deleteImage(img: Image) {
    await this.imgService.deleteImage(img.id);
    const index = this.images.indexOf(img);
    this.images.splice(index, 1);
  }

}

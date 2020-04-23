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
  isSaveInProgress: boolean = false;
  errorMessage: string;
  imageErrorMessage: string;

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
    this.errorMessage = '';
    this.isSaveInProgress = true;

    try {
      if (this.isNewBand) {
        const bandAdded = await this.bandService.createBand(this.bandForm.value);
        const bandId = bandAdded.id;

        console.log(bandId);
        for (const image of this.images) {
          console.log(image)
          await this.imgService.uploadImage(bandId, image.url);
        }
      } else {
        await this.bandService.updateBand(this.bandForm.value);
      }
    } catch (err) {
      console.error(err);
      const res = err.error;
      this.errorMessage = res.error || 'Error occurred while saving band.';
    }

    this.isSaveInProgress = false;
    this.goBack();
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
    this.imageErrorMessage = '';
    this.isUploadInProgress = true;

    const bandId = this.bandForm.get('id').value;
    const files: FileList = this.fileUpload.nativeElement.files;

    for (const file of Array.from(files)) {
      try {
        const base64URI = await this.fileToBase64(file);
        const image: Image = this.isNewBand
          ? await this.imgService.uploadImage(bandId, base64URI, { temp: true })
          : await this.imgService.uploadImage(bandId, base64URI);
        this.images.push(image);
      } catch (err) {
        this.imageErrorMessage = `${err.error} (${file.name})`;
        this.isUploadInProgress = false;
      }
    }

    this.imageForm.nativeElement.reset();
    this.isUploadInProgress = false;
  }

  async deleteImage(img: Image) {
    if (!this.isNewBand) {
      await this.imgService.deleteImage(img.id);
    }

    const index = this.images.indexOf(img);
    this.images.splice(index, 1);
  }

}

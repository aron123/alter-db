import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageAdapter, Image } from 'src/app/core/models/image.model';
import { SuccessResponse, SuccessResponseAdapter } from 'src/app/core/models/success-response.model';

interface ImageUploadOptions {
  temp: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    public http: HttpClient,
    public responseAdapter: SuccessResponseAdapter,
    public imageAdapter: ImageAdapter) { }

  async getImagesOfBand(bandId: number): Promise<Image[]> {
    const res: SuccessResponse = this.responseAdapter.adapt(await this.http.get(`/api/image/band/${bandId}`).toPromise());
    return res.data.map(img => this.imageAdapter.adapt(img));
  }

  async uploadImage(bandId: number, base64URI: string, options: ImageUploadOptions = { temp: false }): Promise<Image> {
    if (options.temp) {
      return new Image(undefined, undefined, base64URI, base64URI);
    }

    const base64 = base64URI.split(',')[1];

    try {
      const formData = new FormData();
      formData.append('image', base64);
      const res = await this.http.post('https://api.imgur.com/3/upload/', formData).toPromise();
      const img = this.imageAdapter.back(new Image(undefined, bandId, res['data'].link, undefined));
      const imageSavedRes: SuccessResponse = this.responseAdapter.adapt(await this.http.post('/api/image', img).toPromise());
      return this.imageAdapter.adapt(imageSavedRes.data);
    } catch (err) {
      console.error(err);
      throw { error: 'Error occurred while uploading a file.' };
    }
  }

  async deleteImage(id: number): Promise<any> {
    await this.http.delete(`/api/image/${id}`).toPromise();
  }
}

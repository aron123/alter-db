import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageAdapter, Image } from 'src/app/core/models/image.model';
import { SuccessResponse, SuccessResponseAdapter } from 'src/app/core/models/success-response.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    public http: HttpClient,
    public responseAdapter: SuccessResponseAdapter,
    public imageAdapter: ImageAdapter) { }

  async getImagesOfBand(bandId: number) {
    const res: SuccessResponse = this.responseAdapter.adapt(await this.http.get(`/api/image/band/${bandId}`).toPromise());
    return res.data;
  }

  async uploadImage(bandId: number, base64: string): Promise<Image> {
    try {
      const formData = new FormData();
      formData.append('image', base64);
      const res = await this.http.post('https://api.imgur.com/3/upload/', formData).toPromise();

      const img = this.imageAdapter.back(new Image(undefined, bandId, res['data'].link));
      const imageSavedRes: SuccessResponse = this.responseAdapter.adapt(await this.http.post('/api/image', img).toPromise());
      return this.imageAdapter.adapt(imageSavedRes.data);
    } catch (err) {
      // TODO
      console.error(err);
    }
  }

  async deleteImage(id: number): Promise<any> {
    await this.http.delete(`/api/image/${id}`).toPromise();
  }
}

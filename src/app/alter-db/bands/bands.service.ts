import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Band, BandAdapter } from 'src/app/core/models/band.model';
import { SuccessResponse, SuccessResponseAdapter } from 'src/app/core/models/success-response.model';

@Injectable({
  providedIn: 'root'
})
export class BandsService {

  constructor(
    public http: HttpClient,
    public bandAdapter: BandAdapter,
    public responseAdapter: SuccessResponseAdapter) { }

  async getAllBands(): Promise<Band[]> {
    const res: SuccessResponse = this.responseAdapter.adapt(await this.http.get('/api/band/').toPromise());
    return res.data.map(band => this.bandAdapter.adapt(band));
  }

  async getBandById(id: number): Promise<Band> {
    const res: SuccessResponse = this.responseAdapter.adapt(await this.http.get(`/api/band/${id}`).toPromise());
    return this.bandAdapter.adapt(res.data);
  }

  async updateBand(band: Band): Promise<any> {
    await this.http.put(`/api/band/${band.id}`, this.bandAdapter.back(band)).toPromise();
  }

  async createBand(band: Band): Promise<any> {
    await this.http.post(`/api/band/`, this.bandAdapter.back(band)).toPromise();
  }

  async exportBandsToDocx(): Promise<Blob> {
    return await this.http.get('/api/band/export/docx', { responseType: 'blob' }).toPromise();
  }

  async exportBandsToJson(): Promise<Blob> {
    return await this.http.get('/api/band/export/json', { responseType: 'blob' }).toPromise();
  }
}

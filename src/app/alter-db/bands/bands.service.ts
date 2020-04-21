import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Band, BandAdapter } from 'src/app/core/models/band.model';

@Injectable({
  providedIn: 'root'
})
export class BandsService {

  constructor(public http: HttpClient, public adapter: BandAdapter) { }

  async getAllBands(): Promise<Band[]> {
    const res = await this.http.get('/api/band/').toPromise();
    return res['data'].map(band => this.adapter.adapt(band));
  }

  async getBandById(id: number): Promise<Band> {
    const res = await this.http.get(`/api/band/${id}`).toPromise();
    return this.adapter.adapt(res['data']);
  }

  async updateBand(band: Band): Promise<any> {
    await this.http.put(`/api/band/${band.id}`, this.adapter.back(band)).toPromise();
  }

  async createBand(band: Band): Promise<any> {
    await this.http.post(`/api/band/`, this.adapter.back(band)).toPromise();
  }

  async exportBands(): Promise<Blob> {
    return await this.http.get('/api/band/export', { responseType: 'blob' }).toPromise();
  }
}

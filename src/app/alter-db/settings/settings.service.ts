import { Injectable } from '@angular/core';
import { SuccessResponseAdapter, SuccessResponse } from 'src/app/core/models/success-response.model';
import { HttpClient } from '@angular/common/http';
import { UserAdapter, User } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    public http: HttpClient,
    public userAdapter: UserAdapter,
    public responseAdapter: SuccessResponseAdapter) { }

  async whoAmI(): Promise<User> {
    const res: SuccessResponse = this.responseAdapter.adapt(await this.http.get('/api/user/me').toPromise());
    return this.userAdapter.adapt(res.data);
  }

  async changePassword(user: User): Promise<any> {
    await this.http.put(`/api/user/password`, this.userAdapter.back(user)).toPromise();
  }
}

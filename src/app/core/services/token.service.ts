import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private accessTokenKey = 'accessToken';
  private storage: Storage = window.localStorage;

  constructor() { }

  setToken(token: string) {
    this.storage.setItem(this.accessTokenKey, token);
  }

  getToken() {
    const token = this.storage.getItem(this.accessTokenKey);
    return token ? token : '';
  }

  removeToken() {
    this.storage.removeItem(this.accessTokenKey);
  }

}

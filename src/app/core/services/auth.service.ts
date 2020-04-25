import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper: JwtHelperService;

  constructor(
    public http: HttpClient,
    public tokenService: TokenService,
    public router: Router) {
    this.jwtHelper = new JwtHelperService();
  }

  async register(user: any): Promise<any> {
    await this.http.post('/api/user/register', user).toPromise();
  }

  async activate(key: string): Promise<any> {
    return await this.http.post(`/api/user/activate/${key}`, {}).toPromise();
  }

  async login(nick: string, password: string) {
    let res: any;

    try {
      res = await this.http.post('/api/user/login', { nick, password }).toPromise();
      if (res.success) {
        this.tokenService.setToken(res.accessToken);
        this.router.navigateByUrl('');
      }
    } catch (err) {
      const body = err.error;

      if (err.status === 401) {
        throw new Error(body.error);
      } else {
        throw new Error('Server error occurred.')
      }
    }
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    const accessToken = this.tokenService.getToken();

    if (!accessToken) {
      return false;
    }

    try {
      const isExpired = this.jwtHelper.isTokenExpired(accessToken);
      return !isExpired;
    } catch (err) {
      // invalid access token
      return false;
    }
  }
}

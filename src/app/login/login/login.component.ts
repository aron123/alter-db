import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  nick: string;
  password: string;
  alertMessage: string;
  loading: boolean = false;

  constructor(
    public router: Router,
    public authService: AuthService) { }

  async login() {
    this.alertMessage = '';
    this.loading = true;

    try {
      await this.authService.login(this.nick, this.password);
    } catch (err) {
      this.alertMessage = err.message;
    }

    this.loading = false;
  }

}

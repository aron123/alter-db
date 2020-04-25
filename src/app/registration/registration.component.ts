import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  isRegistrationSucceeded: boolean = false;
  loading: boolean = false;
  alertMessage: string;
  registrationForm: FormGroup = new FormGroup({
    nick: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    grecaptcha: new FormControl('')
  });

  recaptcha: any;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    window['onloadCallback'] = this.onRecaptchaCallback;
    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit');
    script.setAttribute('async', 'async');
    script.setAttribute('defer', 'defer');
    document.body.append(script);
  }

  onRecaptchaCallback = () => {
    this.recaptcha = window['grecaptcha'].render('grecaptcha', {
      'sitekey' : environment.recaptchaSiteKey
    });
  }

  async register() {
    this.loading = true;
    this.alertMessage = '';

    this.registrationForm.patchValue({
      grecaptcha: window['grecaptcha'].getResponse(this.recaptcha)
    });

    try {
      await this.authService.register(this.registrationForm.value);
    } catch (err) {
      this.alertMessage = err.error.error;
      this.loading = false;
      window['grecaptcha'].reset();
      return;
    }

    this.loading = false;
    this.isRegistrationSucceeded = true;
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-activation',
  templateUrl: './email-activation.component.html',
  styleUrls: ['./email-activation.component.css']
})
export class EmailActivationComponent implements OnInit {

  loaded: boolean = false;
  isError: boolean = false;
  message: string = '';

  constructor(
    public authService: AuthService,
    public activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    const activationKey = this.activatedRoute.snapshot.queryParams['key'];

    try {
      const res = await this.authService.activate(activationKey);
      if (res.success) {
        this.isError = false;
      }
    } catch (err) {
      this.isError = true;
      this.message = err.error.error || 'Unexpected error occurred.';
    }

    this.loaded = true;
  }

}

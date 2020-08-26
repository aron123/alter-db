import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settingsForm = new FormGroup({
    id: new FormControl(0),
    nick: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    password: new FormControl('')
  });

  alertMessage: string = '';
  isSubmitInProgress: boolean = false;
  isSuccess: boolean;

  constructor(public settingsService: SettingsService) { }

  async ngOnInit() {
    const user = await this.settingsService.whoAmI();
    this.settingsForm.setValue(user);
  }

  async changePassword() {
    this.isSubmitInProgress = true;

    const data = this.settingsForm.getRawValue();

    try {
      await this.settingsService.changePassword(data);
      this.alertMessage = 'Your password is changed successfully.';
      this.isSuccess = true;
    } catch (err) {
      this.alertMessage = err.error.error;
      this.isSuccess = false;
    }

    this.isSubmitInProgress = false;
  }

}

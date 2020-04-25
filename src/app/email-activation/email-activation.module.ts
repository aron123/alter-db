import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailActivationRoutingModule } from './email-activation-routing.module';
import { EmailActivationComponent } from './email-activation.component';


@NgModule({
  declarations: [EmailActivationComponent],
  imports: [
    CommonModule,
    EmailActivationRoutingModule
  ]
})
export class EmailActivationModule { }

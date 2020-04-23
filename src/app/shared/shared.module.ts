import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';



@NgModule({
  declarations: [
    SubmitButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SubmitButtonComponent
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailActivationComponent } from './email-activation.component';


const routes: Routes = [
  {
    path: '',
    component: EmailActivationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailActivationRoutingModule { }

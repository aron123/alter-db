import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlterDBComponent } from './alter-db/alter-db.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AlterDBComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlterDBRoutingModule { }

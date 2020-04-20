import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlterDBComponent } from './alter-db.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { BandsComponent } from './bands/bands.component';
import { BandEditFormComponent } from './bands/band-edit-form/band-edit-form.component';
import { ExportComponent } from './export/export.component';

const routes: Routes = [
  {
    path: '',
    component: AlterDBComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: BandsComponent
      },
      {
        path: 'bands',
        component: BandsComponent
      },
      {
        path: 'bands/edit/:id',
        component: BandEditFormComponent
      },
      {
        path: 'export',
        component: ExportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlterDBRoutingModule { }

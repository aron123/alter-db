import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlterDBComponent } from './alter-db.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { BandsComponent } from './bands/bands.component';
import { BandFormComponent } from './bands/band-form/band-form.component';
import { ExportComponent } from './export/export.component';
import { SiteLogComponent } from './site-log/site-log.component';
import { AboutComponent } from './about/about.component';

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
        path: 'bands/new',
        component: BandFormComponent
      },
      {
        path: 'bands/:id',
        component: BandFormComponent
      },
      {
        path: 'export',
        component: ExportComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'site-log',
        component: SiteLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlterDBRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlterDBRoutingModule } from './alter-db-routing.module';
import { AlterDBComponent } from './alter-db.component';
import { BandsComponent } from './bands/bands.component';
import { BandFormComponent } from './bands/band-form/band-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportComponent } from './export/export.component';
import { SiteLogComponent } from './site-log/site-log.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { SubmitButtonComponent } from '../shared/components/submit-button/submit-button.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AlterDBComponent,
    BandsComponent,
    BandFormComponent,
    ExportComponent,
    SiteLogComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    AlterDBRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule
  ]
})
export class AlterDBModule { }

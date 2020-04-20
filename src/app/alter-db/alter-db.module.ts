import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlterDBRoutingModule } from './alter-db-routing.module';
import { AlterDBComponent } from './alter-db.component';
import { BandsComponent } from './bands/bands.component';
import { BandEditFormComponent } from './bands/band-edit-form/band-edit-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportComponent } from './export/export.component';

@NgModule({
  declarations: [AlterDBComponent, BandsComponent, BandEditFormComponent, ExportComponent],
  imports: [
    CommonModule,
    AlterDBRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AlterDBModule { }

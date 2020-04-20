import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlterDBRoutingModule } from './alter-db-routing.module';
import { AlterDBComponent } from './alter-db/alter-db.component';

@NgModule({
  declarations: [AlterDBComponent],
  imports: [
    CommonModule,
    AlterDBRoutingModule
  ]
})
export class AlterDBModule { }

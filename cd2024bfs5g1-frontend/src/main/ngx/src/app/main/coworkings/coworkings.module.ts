import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';
import { ODateRangeInputModule, OntimizeWebModule } from 'ontimize-web-ngx';
import { CoworkingsHomeComponent } from './coworkings-home/coworkings-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoworkingsNewComponent } from './coworkings-new/coworkings-new.component';


@NgModule({
  declarations: [
    CoworkingsHomeComponent,
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule,
    SharedModule,
    ODateRangeInputModule
  ]
})
export class CoworkingsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { CoworkingsHomeComponent } from './coworkings-home/coworkings-home.component';
import { CoworkingsNewComponent } from './coworkings-new/coworkings-new.component';


@NgModule({
  declarations: [
    CoworkingsDetailComponent,
    CoworkingsHomeComponent,
    CoworkingsNewComponent
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule
  ]
})
export class CoworkingsModule { }

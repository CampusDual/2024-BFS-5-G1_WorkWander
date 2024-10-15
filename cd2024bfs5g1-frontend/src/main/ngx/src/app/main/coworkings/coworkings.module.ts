import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';
import { OntimizeWebModule } from 'ontimize-web-ngx';


@NgModule({
  declarations: [
    CoworkingsDetailComponent,
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule
  ]
})
export class CoworkingsModule { }

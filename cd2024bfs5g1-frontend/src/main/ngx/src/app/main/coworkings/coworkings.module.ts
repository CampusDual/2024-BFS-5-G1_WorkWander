import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoworkingsHomeComponent } from './coworkings-home/coworkings-home.component';
import { CoworkingsRoutingModule } from './coworkings-routing.module';


@NgModule({
  declarations: [
    CoworkingsHomeComponent,
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule,
    SharedModule
  ]
})
export class CoworkingsModule { }

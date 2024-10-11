import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { CoworkingsNewComponent } from '../coworkings-new/coworkings-new.component';


@NgModule({
  declarations: [
    CoworkingsNewComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    CoworkingsRoutingModule
  ]
})
export class CoworkingsModule { }

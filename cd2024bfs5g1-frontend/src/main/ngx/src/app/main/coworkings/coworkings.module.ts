import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';
import { ODateRangeInputModule, OntimizeWebModule } from 'ontimize-web-ngx';
import { CoworkingsHomeComponent } from './coworkings-home/coworkings-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    CoworkingsHomeComponent,
    CoworkingsDetailComponent
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule,
    SharedModule,
    ODateRangeInputModule,
    MatRadioModule
  ]
})
export class CoworkingsModule { }

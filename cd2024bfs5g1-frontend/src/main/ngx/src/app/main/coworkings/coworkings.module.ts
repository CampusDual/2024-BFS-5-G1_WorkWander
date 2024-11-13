import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { CoworkingsHomeComponent } from './coworkings-home/coworkings-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';


@NgModule({
  declarations: [
    CoworkingsHomeComponent,
    CoworkingsDetailComponent
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule,
    SharedModule
  ]
})
export class CoworkingsModule { }

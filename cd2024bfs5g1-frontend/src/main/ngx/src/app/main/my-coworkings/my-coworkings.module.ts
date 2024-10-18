import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCoworkingsRoutingModule } from './my-coworkings-routing.module';
import { OntimizeWebModule, OPermissionsModule } from 'ontimize-web-ngx';
import { MyCoworkingsHomeComponent } from './my-coworkings-home/my-coworkings-home.component';


@NgModule({
  declarations: [
    MyCoworkingsHomeComponent,
  ],
  imports: [
    CommonModule,
    MyCoworkingsRoutingModule,
    OntimizeWebModule,
    OPermissionsModule
  ]
})
export class MyCoworkingsModule { }

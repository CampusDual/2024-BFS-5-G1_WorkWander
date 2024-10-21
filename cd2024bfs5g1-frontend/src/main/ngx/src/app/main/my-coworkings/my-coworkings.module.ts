import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCoworkingsRoutingModule } from './my-coworkings-routing.module';
import { OntimizeWebModule, OPermissionsModule } from 'ontimize-web-ngx';
import { MyCoworkingsHomeComponent } from './my-coworkings-home/my-coworkings-home.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MyCoworkingsHomeComponent,
  ],
  imports: [
    CommonModule,
    MyCoworkingsRoutingModule,
    OntimizeWebModule,
    OPermissionsModule,
    SharedModule
  ]
})
export class MyCoworkingsModule { }

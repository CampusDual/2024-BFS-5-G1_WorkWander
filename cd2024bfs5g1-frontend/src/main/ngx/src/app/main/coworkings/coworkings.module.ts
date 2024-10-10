import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';


@NgModule({
  declarations: [
    CoworkingsDetailComponent
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule
  ]
})
export class CoworkingsModule { }

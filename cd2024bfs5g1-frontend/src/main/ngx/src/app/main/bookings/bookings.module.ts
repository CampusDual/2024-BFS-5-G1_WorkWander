import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingsHomeComponent } from './bookings-home/bookings-home.component';
import { OntimizeWebModule, OPermissionsModule } from 'ontimize-web-ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingsStateRenderComponent } from './bookings-home/bookings-state-render/bookings-state-render.component';


@NgModule({
  declarations: [
    BookingsHomeComponent,
    BookingsStateRenderComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    OntimizeWebModule,
    OPermissionsModule,
    SharedModule
  ]
})
export class BookingsModule { }

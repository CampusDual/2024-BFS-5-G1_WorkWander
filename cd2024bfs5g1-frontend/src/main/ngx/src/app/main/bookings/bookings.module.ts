import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingsHomeComponent } from './bookings-home/bookings-home.component';
import { OntimizeWebModule, OPermissionsModule } from 'ontimize-web-ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingsStateRenderComponent } from './bookings-home/bookings-state-render/bookings-state-render.component';
import { BookingsRateRenderComponent } from './bookings-home/bookings-rate-render/bookings-rate-render.component';
import { RatingModule } from 'primeng/rating';
import { BookingRateComponent } from './booking-rate/booking-rate.component';
import { BookingsCancelRenderComponent } from './bookings-home/bookings-cancel-render/bookings-cancel-render.component';
import { OMapModule } from 'ontimize-web-ngx-map';


@NgModule({
  declarations: [
    BookingsHomeComponent,
    BookingsStateRenderComponent,
    BookingsRateRenderComponent,
    BookingRateComponent,
    BookingsCancelRenderComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    OntimizeWebModule,
    OPermissionsModule,
    SharedModule,
    RatingModule,
    OMapModule,
  ]
})
export class BookingsModule { }

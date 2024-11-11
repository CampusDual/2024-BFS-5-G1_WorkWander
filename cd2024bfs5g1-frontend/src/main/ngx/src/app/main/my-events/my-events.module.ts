import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyEventsRoutingModule } from './my-events-routing.module';
import { MyEventsHomeComponent } from './my-events-home/my-events-home.component';
import { OntimizeWebModule, OPermissionsModule } from 'ontimize-web-ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventsDetailComponent } from '../events/events-detail/events-detail.component';


@NgModule({
  declarations: [
    MyEventsHomeComponent
  ],
  imports: [
    CommonModule,
    MyEventsRoutingModule,
    OntimizeWebModule,
    OPermissionsModule,
    SharedModule
  ]
})
export class MyEventsModule { }

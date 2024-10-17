import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { EventsNewComponent } from './events-new/events-new.component';


@NgModule({
  declarations: [
    EventsNewComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }

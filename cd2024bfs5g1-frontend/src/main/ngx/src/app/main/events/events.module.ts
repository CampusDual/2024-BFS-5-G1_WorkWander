import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { EventsNewComponent } from './events-new/events-new.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventsHomeComponent } from './events-home/events-home.component';

@NgModule({
  declarations: [
    EventsNewComponent,
    EventsHomeComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    EventsRoutingModule,
    SharedModule
  ]
})
export class EventsModule { }

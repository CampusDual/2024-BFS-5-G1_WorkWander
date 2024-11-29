import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayPilot, DayPilotModule } from "@daypilot/daypilot-lite-angular";
import { MyCalendarRoutingModule } from './my-calendar-routing.module';
import { MyCalendarHomeComponent } from './my-calendar-home/my-calendar-home.component';
import { OntimizeWebModule } from 'ontimize-web-ngx';

@NgModule({
  declarations: [
    MyCalendarHomeComponent
  ],
  imports: [
    CommonModule,
    MyCalendarRoutingModule,
    DayPilotModule,
    OntimizeWebModule
  ]
})
export class MyCalendarModule { }

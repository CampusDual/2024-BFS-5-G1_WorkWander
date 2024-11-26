import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCalendarRoutingModule } from './my-calendar-routing.module';
import { MyCalendarHomeComponent } from './my-calendar-home/my-calendar-home.component';


@NgModule({
  declarations: [
    MyCalendarHomeComponent
  ],
  imports: [
    CommonModule,
    MyCalendarRoutingModule
  ]
})
export class MyCalendarModule { }

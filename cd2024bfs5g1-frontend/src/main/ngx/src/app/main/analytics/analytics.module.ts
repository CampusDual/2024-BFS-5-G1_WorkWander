import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsOccupationComponent } from './analytics-occupation/analytics-occupation.component';


@NgModule({
  declarations: [
    AnalyticsOccupationComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }

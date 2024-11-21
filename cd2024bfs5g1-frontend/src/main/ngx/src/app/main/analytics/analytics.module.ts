import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsOccupationComponent } from './analytics-occupation/analytics-occupation.component';
import { OChartModule } from 'ontimize-web-ngx-charts';


@NgModule({
  declarations: [
    AnalyticsOccupationComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    OChartModule
  ]
})
export class AnalyticsModule { }

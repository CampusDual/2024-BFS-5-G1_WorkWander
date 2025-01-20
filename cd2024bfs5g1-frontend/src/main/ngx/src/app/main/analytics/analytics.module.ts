import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AnalyticsRoutingModule } from "./analytics-routing.module";
import { AnalyticsOccupationComponent } from "./analytics-occupation/analytics-occupation.component";
import { OChartModule } from "ontimize-web-ngx-charts";
import { MatTabsModule } from "@angular/material/tabs";
import { ODateRangeInputModule, OntimizeWebModule } from "ontimize-web-ngx";
import { AnalyticsFacturationComponent } from './analytics-facturation/analytics-facturation.component';
import { AnalyticsEventsComponent } from './analytics-events/analytics-events.component';
import { DayPilotModule } from "@daypilot/daypilot-lite-angular";

@NgModule({
  declarations: [AnalyticsOccupationComponent, AnalyticsFacturationComponent, AnalyticsEventsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    OChartModule,
    MatTabsModule,
    OntimizeWebModule,
    ODateRangeInputModule,
    DayPilotModule
  ],
})
export class AnalyticsModule {}

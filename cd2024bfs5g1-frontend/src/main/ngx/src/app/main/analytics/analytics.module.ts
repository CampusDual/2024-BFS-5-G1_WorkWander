import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AnalyticsRoutingModule } from "./analytics-routing.module";
import { AnalyticsOccupationComponent } from "./analytics-occupation/analytics-occupation.component";
import { OChartModule } from "ontimize-web-ngx-charts";
import { MatTabsModule } from "@angular/material/tabs";
import { OntimizeWebModule } from "ontimize-web-ngx";

@NgModule({
  declarations: [AnalyticsOccupationComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    OChartModule,
    MatTabsModule,
    OntimizeWebModule,
  ],
})
export class AnalyticsModule {}

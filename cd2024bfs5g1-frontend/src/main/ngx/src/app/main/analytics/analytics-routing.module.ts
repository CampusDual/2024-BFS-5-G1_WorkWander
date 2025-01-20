import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsOccupationComponent } from './analytics-occupation/analytics-occupation.component';
import { AnalyticsFacturationComponent } from './analytics-facturation/analytics-facturation.component';
import { AnalyticsEventsComponent } from './analytics-events/analytics-events.component';

const routes: Routes = [
    {
      path: "occupation",
      component: AnalyticsOccupationComponent,
      data: {
            oPermission: {
              permissionId: "analyticsOccupation",
              restrictedPermissionsRedirect: "403",
            },
          },
    },
    {
      path: "facturation",
      component: AnalyticsFacturationComponent,
      data: {
            oPermission: {
              permissionId: "analyticsFacturation",
              restrictedPermissionsRedirect: "403",
            },
          },
    },
    {
      path: "events",
      component: AnalyticsEventsComponent,
      data: {
            oPermission: {
              permissionId: "analyticsEvents",
              restrictedPermissionsRedirect: "403",
            },
          },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }

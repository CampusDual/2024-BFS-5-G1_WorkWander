import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsOccupationComponent } from './analytics-occupation/analytics-occupation.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }

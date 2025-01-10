import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService, PermissionsGuardService } from "ontimize-web-ngx";

import { MainComponent } from "./main.component";
import { ProfileComponent } from "./profile/profile.component";

export const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [PermissionsGuardService],
    children: [
      { path: "", redirectTo: "coworkings", pathMatch: "full" },
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "coworkings",
        loadChildren: () =>
          import("./coworkings/coworkings.module").then(
            (m) => m.CoworkingsModule
          ),
      },
      {
        path: "mycoworkings",
        loadChildren: () =>
          import("./my-coworkings/my-coworkings.module").then(
            (m) => m.MyCoworkingsModule
          ),
      },
      //TODO
      //{ path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
      { path: "profile", component: ProfileComponent },
      {
        path: "events",
        loadChildren: () =>
          import("./events/events.module").then((m) => m.EventsModule),
      },
      {
        path: "myevents",
        loadChildren: () =>
          import("./my-events/my-events.module").then((m) => m.MyEventsModule),
      },
      {
        path: "mycalendar",
        loadChildren: () =>
          import("./my-calendar/my-calendar.module").then(
            (m) => m.MyCalendarModule
          ),
      },
      {
        path: "bookings",
        loadChildren: () =>
          import("./bookings/bookings.module").then((m) => m.BookingsModule),
      },
      { path: "analytics", loadChildren: () => import("./analytics/analytics.module").then((m) => m.AnalyticsModule), }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }

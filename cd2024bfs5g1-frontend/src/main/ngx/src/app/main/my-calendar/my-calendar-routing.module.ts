import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyCalendarHomeComponent } from "./my-calendar-home/my-calendar-home.component";

const routes: Routes = [
  {
    path: "",
    component: MyCalendarHomeComponent,
    data: {
      oPermission: {
        permissionId: "myCalendar",
        redirectedPermissionsRedirect: 403,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCalendarRoutingModule {}

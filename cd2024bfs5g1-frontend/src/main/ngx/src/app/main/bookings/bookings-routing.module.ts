import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BookingsHomeComponent } from "./bookings-home/bookings-home.component";

const routes: Routes = [
  {
    path: "",
    component: BookingsHomeComponent,
    data: {
      oPermission: {
        permissionId: "Bookings",
        redirectedPermissionsRedirect: 403,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsRoutingModule {}

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoworkingsNewComponent } from "./coworkings-new/coworkings-new.component";
import { CoworkingsDetailComponent } from "./coworkings-detail/coworkings-detail.component";

const routes: Routes = [
  {
    path: "new",
    component: CoworkingsNewComponent,
    data: {
      oPermission: {
        permissionId: "coworkings-new-route",
        restrictedPermissionsRedirect: "403",
      },
    },
  },
  {
    path: "cw_id",
    component: CoworkingsDetailComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoworkingsRoutingModule {}

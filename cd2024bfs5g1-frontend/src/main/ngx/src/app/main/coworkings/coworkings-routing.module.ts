import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoworkingsDetailComponent } from "./coworkings-detail/coworkings-detail.component";
import { CoworkingsHomeComponent } from "./coworkings-home/coworkings-home.component";

const routes: Routes = [
  { path: "", component: CoworkingsHomeComponent },
  { path: ":cw_id", component: CoworkingsDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoworkingsRoutingModule {}

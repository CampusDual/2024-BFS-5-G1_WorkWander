import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoworkingsDetailComponent } from "./coworkings-detail/coworkings-detail.component";
import { CoworkingsNewComponent } from "./coworkings-new/coworkings-new.component";

const routes: Routes = [
  { path: "", component: CoworkingsNewComponent },
  { path: ":id", component: CoworkingsDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoworkingsRoutingModule {}

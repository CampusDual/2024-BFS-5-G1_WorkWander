import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OntimizeWebModule } from "ontimize-web-ngx";
import { LandingComponent } from "./landing.component";
import { LandingRoutingModule } from "./landing-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    OntimizeWebModule,
    SharedModule,
    LandingRoutingModule,
  ],
})
export class LandingModule {}

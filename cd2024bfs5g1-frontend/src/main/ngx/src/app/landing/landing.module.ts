import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OntimizeWebModule } from "ontimize-web-ngx";
import { LandingComponent } from "./landing.component";
import { LandingRoutingModule } from "./landing-routing.module";
import { SharedModule } from "../shared/shared.module";
import { CarouselModule } from "primeng/carousel";

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    OntimizeWebModule,
    SharedModule,
    LandingRoutingModule,
    CarouselModule,
  ],
})
export class LandingModule {}

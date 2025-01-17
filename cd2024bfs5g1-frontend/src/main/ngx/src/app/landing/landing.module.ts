import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OntimizeWebModule } from "ontimize-web-ngx";
import { LandingComponent } from "./landing.component";
import { LandingRoutingModule } from "./landing-routing.module";
import { SharedModule } from "../shared/shared.module";
import { CarouselModule } from "primeng/carousel";
import { LandingLegalComponent } from './landing-legal/landing-legal.component';
import { LandingPrivacyComponent } from './landing-privacy/landing-privacy.component';
import { LandingCookiesComponent } from './landing-cookies/landing-cookies.component';

@NgModule({
  declarations: [LandingComponent, LandingLegalComponent, LandingPrivacyComponent, LandingCookiesComponent],
  imports: [
    CommonModule,
    OntimizeWebModule,
    SharedModule,
    LandingRoutingModule,
    CarouselModule,
  ],
})
export class LandingModule {}

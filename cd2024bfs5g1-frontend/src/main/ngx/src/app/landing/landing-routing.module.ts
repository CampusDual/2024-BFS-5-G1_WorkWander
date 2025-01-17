import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./landing.component";
import { LandingLegalComponent } from "./landing-legal/landing-legal.component";
import { LandingCookiesComponent } from "./landing-cookies/landing-cookies.component";
import { LandingPrivacyComponent } from "./landing-privacy/landing-privacy.component";

const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "legal", component: LandingLegalComponent },
  { path: "privacy", component: LandingPrivacyComponent },
  { path: "cookies", component: LandingCookiesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}

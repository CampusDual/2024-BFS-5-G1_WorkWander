import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { OntimizeWebModule } from "ontimize-web-ngx";

import { SharedModule } from "../shared/shared.module";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";

@NgModule({
  imports: [
    SharedModule,
    OntimizeWebModule,
    LoginRoutingModule,
    MatIconModule, // Añadir si no está incluido en SharedModule
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}

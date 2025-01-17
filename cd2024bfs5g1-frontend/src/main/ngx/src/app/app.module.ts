import { NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ServiceWorkerModule } from '@angular/service-worker';
import { APP_CONFIG, O_FORM_GLOBAL_CONFIG, O_MAT_ERROR_OPTIONS, O_PERMISSION_SERVICE, ONTIMIZE_PROVIDERS, OntimizeWebModule } from 'ontimize-web-ngx';

import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './app.config';
import { CustomPermissionsService } from './shared/services/custom-permissions.service';
import { MainService } from './shared/services/main.service';

import { O_GEOCODING_SERVICE, OMapModule } from 'ontimize-web-ngx-map';
import { CustomGeocodingService } from './shared/services/custom-geocoding.service';
import { QRCodeModule } from "angularx-qrcode";

// Standard providers...
// Defining custom providers (if needed)...
export const customProviders: any = [
  MainService,
  { provide: O_MAT_ERROR_OPTIONS, useValue: { type: "lite" } },
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "fill" } },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OntimizeWebModule.forRoot(CONFIG),
    OntimizeWebModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    MatIconModule,
    OMapModule,
    QRCodeModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_CONFIG, useValue: CONFIG },
    ONTIMIZE_PROVIDERS,
    { provide: O_PERMISSION_SERVICE, useValue: CustomPermissionsService },
    { provide: O_FORM_GLOBAL_CONFIG, useValue: { headersActions: "C,U" } },
    ...customProviders,
    { provide: O_GEOCODING_SERVICE, useValue: CustomGeocodingService },
  ],
})
export class AppModule {}

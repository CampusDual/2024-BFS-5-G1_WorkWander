import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { ODateRangeInputModule, OntimizeWebModule } from 'ontimize-web-ngx';
import { OMapModule } from 'ontimize-web-ngx-map';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';
import { CoworkingsHomeComponent } from './coworkings-home/coworkings-home.component';
import { CoworkingsRoutingModule } from './coworkings-routing.module';


@NgModule({
  declarations: [
    CoworkingsHomeComponent,
    CoworkingsDetailComponent,
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule,
    SharedModule,
    ODateRangeInputModule,
    MatRadioModule,
    OMapModule,
    CarouselModule,
    RatingModule
  ]
})
export class CoworkingsModule { }

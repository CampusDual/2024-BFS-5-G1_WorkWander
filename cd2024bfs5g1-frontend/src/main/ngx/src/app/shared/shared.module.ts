import { CommonModule, formatDate } from '@angular/common';
import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { FilterComponent } from './components/filters/filters.component';
import { HomeToolbarComponent } from './components/home-toolbar/home-toolbar.component';
import { CoworkingsNewComponent } from '../main/coworkings/coworkings-new/coworkings-new.component';
import { EventsDetailComponent } from '../main/events/events-detail/events-detail.component';
import { UtilsService } from './services/utils.service';
import { CoworkingsEditComponent } from '../main/coworkings/coworkings-edit/coworkings-edit.component';
import { NumberToArrayPipe } from '../pipes/number-to-array.pipe';
import { OMapModule } from 'ontimize-web-ngx-map';
import { EventsEditComponent } from '../main/events/events-edit/events-edit.component';

@NgModule({
  imports: [
    OntimizeWebModule,
    OMapModule
  ],
  declarations: [
    FilterComponent,
    HomeToolbarComponent,
    CoworkingsNewComponent,
    EventsDetailComponent,
    CoworkingsEditComponent,
    EventsEditComponent,
    NumberToArrayPipe
  ],
  exports: [
    CommonModule,
    FilterComponent,
    HomeToolbarComponent,
    EventsDetailComponent,
    NumberToArrayPipe
  ]
})
export class SharedModule { }

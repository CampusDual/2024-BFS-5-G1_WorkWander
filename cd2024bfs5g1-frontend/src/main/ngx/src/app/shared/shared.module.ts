import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { FilterComponent } from './components/filters/filters.component';
import { HomeToolbarComponent } from './components/home-toolbar/home-toolbar.component';
import { CoworkingsDetailComponent } from '../main/coworkings/coworkings-detail/coworkings-detail.component';
import { CoworkingsNewComponent } from '../main/coworkings/coworkings-new/coworkings-new.component';


export function dateStartFunction(rowData: Array<any>): any {

  return rowData["dates"][0];
}

export function dateEndFunction(rowData: Array<any>): any {

  return rowData["dates"][rowData["dates"].length - 1];
}

@NgModule({
  imports: [
    OntimizeWebModule
  ],
  declarations: [
    FilterComponent,
    HomeToolbarComponent,
    CoworkingsDetailComponent,
    CoworkingsNewComponent
  ],
  exports: [
    CommonModule,
    FilterComponent,
    HomeToolbarComponent
  ]
})
export class SharedModule { }

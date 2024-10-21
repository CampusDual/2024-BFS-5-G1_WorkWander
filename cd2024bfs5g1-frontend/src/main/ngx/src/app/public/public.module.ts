import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponentComponent } from './public-component/public-component.component';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PublicComponentComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    OntimizeWebModule,
    SharedModule
  ]
})
export class PublicModule { }

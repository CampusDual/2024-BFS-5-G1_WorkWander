import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoworkingsNewComponent } from './coworkings-new/coworkings-new.component';


const routes: Routes = [{
  path:'new',
  component: CoworkingsNewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoworkingsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyCoworkingsHomeComponent } from './my-coworkings-home/my-coworkings-home.component';

const routes: Routes = [
  { path: '', component: MyCoworkingsHomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCoworkingsRoutingModule { }

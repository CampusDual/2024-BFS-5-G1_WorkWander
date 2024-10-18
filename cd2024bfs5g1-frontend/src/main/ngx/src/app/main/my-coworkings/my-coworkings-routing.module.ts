import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyCoworkingsHomeComponent } from './my-coworkings-home/my-coworkings-home.component';

const routes: Routes = [
  { path: '', component: MyCoworkingsHomeComponent,
      data: {
        oPermission:{
          permissionId:"MyCoworkings",
          redirectedPermissionsRedirect:403
        }
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCoworkingsRoutingModule { }

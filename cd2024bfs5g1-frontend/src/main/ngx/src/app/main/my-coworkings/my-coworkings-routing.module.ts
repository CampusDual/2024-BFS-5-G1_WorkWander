import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyCoworkingsHomeComponent } from './my-coworkings-home/my-coworkings-home.component';
import { CoworkingsNewComponent } from '../coworkings/coworkings-new/coworkings-new.component';
import { CoworkingsEditComponent } from '../coworkings/coworkings-edit/coworkings-edit.component';

const routes: Routes = [
  { path: '', component: MyCoworkingsHomeComponent,
      data: {
        oPermission:{
          permissionId:"MyCoworkings",
          redirectedPermissionsRedirect:403
        }
      }
    },
    {
      path: "new",
      component: CoworkingsNewComponent,
    },
  { path: ":cw_id", component: CoworkingsEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCoworkingsRoutingModule { }

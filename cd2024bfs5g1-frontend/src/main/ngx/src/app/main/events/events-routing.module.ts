import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsNewComponent } from './events-new/events-new.component';


const routes: Routes = [
  {
    path: 'new',
    component: EventsNewComponent,
    data: {
      oPermission: {
        permissionId: 'events-new-route',
        restrictedPermissionsRedirect: '403'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsNewComponent } from './events-new/events-new.component';
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { EventsHomeComponent } from './events-home/events-home.component';

const routes: Routes = [
  { path: "", component: EventsHomeComponent },
  {
    path: 'new',
    component: EventsNewComponent,
    data: {
      oPermission: {
        permissionId: 'events-new-route',
        restrictedPermissionsRedirect: '403'
      }
    }
  },
  { path: ":id_event", component: EventsDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

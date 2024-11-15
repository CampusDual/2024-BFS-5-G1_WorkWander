import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyEventsHomeComponent } from './my-events-home/my-events-home.component';
import { EventsNewComponent } from '../events/events-new/events-new.component';
import { EventsDetailComponent } from '../events/events-detail/events-detail.component';

const routes: Routes = [
  { path: '', component: MyEventsHomeComponent,
      data: {
        oPermission:{
          permissionId:"MyEvents",
          redirectedPermissionsRedirect:403
        }
      }
    },
    {
      path: "new",
      component: EventsNewComponent,
    },
    { path: ":id_event", component: EventsDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MyEventsRoutingModule { }

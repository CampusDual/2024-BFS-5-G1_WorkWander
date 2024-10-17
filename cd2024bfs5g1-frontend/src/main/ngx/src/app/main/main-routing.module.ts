import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService, PermissionsGuardService } from 'ontimize-web-ngx';

import { MainComponent } from './main.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [PermissionsGuardService],
    children: [
      { path: '', redirectTo: 'coworkings', pathMatch: 'full' },
      {
        path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        data: {
          oPermission: {
            restrictedPermissionsRedirect: '403'
          }
        }
       },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
      { path: 'coworkings', loadChildren: () => import ('./coworkings/coworkings.module') .then(m =>m.CoworkingsModule)},
      { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
      { path: 'profile', component: ProfileComponent },
      { path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

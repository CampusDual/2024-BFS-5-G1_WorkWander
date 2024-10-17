import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponentComponent } from './public-component/public-component.component';
import { PermissionsGuardService } from 'ontimize-web-ngx';

export const routes: Routes = [
  {
    component: PublicComponentComponent,
    path: '',
    canActivateChild: [PermissionsGuardService],
    children: [

    { path: 'coworkings', loadChildren: () => import('src/app/main/coworkings/coworkings.module').then(m => m.CoworkingsModule) },
    { path: '', redirectTo: 'coworkings', pathMatch: 'full' },
    { path: '**', redirectTo: 'coworkings', pathMatch: 'full' }
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

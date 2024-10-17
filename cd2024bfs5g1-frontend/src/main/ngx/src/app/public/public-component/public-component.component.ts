import { Component } from '@angular/core';
import { PermissionsService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-public-component',
  templateUrl: './public-component.component.html',
  styleUrls: ['./public-component.component.css']
})
export class PublicComponentComponent {
  hasPermission = false;
  constructor(
    private permissionService: PermissionsService
  ) {
    this.permissionService.getUserPermissionsAsPromise().then(x => this.hasPermission = true);
  }
}

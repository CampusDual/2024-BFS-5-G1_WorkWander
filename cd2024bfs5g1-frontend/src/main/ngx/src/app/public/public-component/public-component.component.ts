import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionsService } from "ontimize-web-ngx";

@Component({
  selector: "app-public-component",
  templateUrl: "./public-component.component.html",
  styleUrls: ["./public-component.component.css"],
})
export class PublicComponentComponent {
  hasPermission = false;
  constructor(
    private permissionService: PermissionsService,
    private router: Router
  ) {
    this.permissionService
      .getUserPermissionsAsPromise()
      .then((x) => (this.hasPermission = true));
  }
  goToLanding() {
    this.router.navigate(["/landing"]);
  }

  onAppLayoutClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const SIDENAV_IMAGES = ["sidenav-closed.png", "sidenav-opened.png"];

    if (!(targetElement?.tagName === "IMG")) return;

    const imageElement = targetElement as HTMLImageElement;
    const imageSrc = imageElement.src || "";

    if (SIDENAV_IMAGES.some((image) => imageSrc.includes(image))) {
      this.goToLanding();
    }
  }
}

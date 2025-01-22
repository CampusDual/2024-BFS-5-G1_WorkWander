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
    const element = event.target as HTMLElement;
    if (element && element.tagName === "IMG") {
      const imageSrc = (element as HTMLImageElement).src || "";
      if (
        imageSrc.includes("sidenav-closed.png") ||
        imageSrc.includes("sidenav-opened.png")
      ) {
        this.goToLanding();
      }
    }
  }
}

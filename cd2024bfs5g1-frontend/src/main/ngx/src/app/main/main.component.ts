import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

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

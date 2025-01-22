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

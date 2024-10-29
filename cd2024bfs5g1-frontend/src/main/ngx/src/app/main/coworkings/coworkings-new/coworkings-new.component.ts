import { Component, ViewChild } from "@angular/core";
import { OFormComponent, ODateInputComponent } from "ontimize-web-ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-coworking-new",
  templateUrl: "./coworkings-new.component.html",
  styleUrls: ["./coworkings-new.component.css"],
})
export class CoworkingsNewComponent {
  public today: string = new Date().toLocaleDateString();

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;

  constructor(private router: Router) {}

  public onInsertSuccess(): void {
    this.coworkingForm.setInitialMode();
    this.router.navigateByUrl("/main/mycoworkings");
  }
}

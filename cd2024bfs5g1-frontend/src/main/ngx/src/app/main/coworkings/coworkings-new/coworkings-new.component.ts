import { Component, ViewChild } from "@angular/core";
import {
  OFormComponent,
  ODateInputComponent,
  OValidators,
} from "ontimize-web-ngx";
import { Router } from "@angular/router";
import { ValidatorFn } from "@angular/forms";

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

  // Validadores personalizados para nombre y descripción
  public validatorsArray: ValidatorFn[] = [
    OValidators.patternValidator(/^[a-zA-Z0-9 ]*$/, "noSpecialCharacters"),
  ];

  constructor(private router: Router) {}

  public onInsertSuccess(): void {
    this.coworkingForm.setInitialMode();
    this.router.navigateByUrl("/main/mycoworkings");
  }
}

import { AfterViewInit, Component, ViewChild } from "@angular/core";
import {
  OFormComponent,
  ODateInputComponent,
  OTranslateService,
} from "ontimize-web-ngx";
import { Router } from "@angular/router";
import { OFormMessageService } from "ontimize-web-ngx";

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

  constructor(
    private router: Router,
    private translate: OTranslateService,
    private messageService: OFormMessageService
  ) {}

  public onInsertSuccess(): void {
    this.coworkingForm.setInitialMode();

    const successMessageTitle = this.translate.get("COWORKING_ADDED");
    const successMessageBody = this.translate.get("COWORKING_ADDED2");

    //this.messageService.info(successMessageTitle, successMessageBody);  }
  }
}

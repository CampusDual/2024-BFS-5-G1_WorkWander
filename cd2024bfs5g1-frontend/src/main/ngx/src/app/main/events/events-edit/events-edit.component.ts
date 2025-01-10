import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  OntimizeService,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";

@Component({
  selector: "app-events-edit",
  templateUrl: "./events-edit.component.html",
  styleUrls: ["./events-edit.component.css"],
})
export class EventsEditComponent {
  constructor(
    private router: Router,
    private translate: OTranslateService,
    private service: OntimizeService,
    protected snackBarService: SnackBarService
  ) {}
  //Devuelve la fecha actual
  currentDate() {
    return new Date();
  }

  OnInsertSuccess() {
    const conf = this.service.getDefaultServiceConfiguration("events");
    this.service.configureService(conf);

    
  }
}

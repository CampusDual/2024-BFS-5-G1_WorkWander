import { Component } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { OntimizeService } from "ontimize-web-ngx";

@Component({
  selector: "app-coworkings-detail",
  templateUrl: "./coworkings-detail.component.html",
  styleUrls: ["./coworkings-detail.component.css"],
})
export class CoworkingsDetailComponent {

  
  currentDate() {
    return new Date();
  }
}

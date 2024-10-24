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
  constructor(private service: OntimizeService) {}

  dateSelected: Date;
  realCapacity: number = 100;

  currentDate() {
    return new Date();
  }

  checkCapacity(data) {
    const filter = {
      bk_cw_id: data["cw_id"],
      bk_date: data["date"],
    };
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];
    this.service.query(filter, columns, "bookingsByDate").subscribe((resp) => {
      if (resp.code === 0) {
        // resp.data contains the data retrieved from the server
      } else {
        alert("Impossible to query data!");
      }
    });
  }
}

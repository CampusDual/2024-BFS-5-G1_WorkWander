import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import {
  ODateInputComponent,
  OFormComponent,
  OntimizeService,
} from "ontimize-web-ngx";

@Component({
  selector: "app-coworkings-detail",
  templateUrl: "./coworkings-detail.component.html",
  styleUrls: ["./coworkings-detail.component.css"],
})
export class CoworkingsDetailComponent {
  constructor(
    private service: OntimizeService,
    private activeRoute: ActivatedRoute
  ) {}

  //Estan añadidos los elementos del html formulario general con #form para tomar el dato de coworking id
  // y el form especifici
  @ViewChild("form") coworkingDetailForm: OFormComponent;
  @ViewChild("date") bookingDate: ODateInputComponent;

  dateSelected: Date;
  realCapacity: number = 100;

  currentDate() {
    return new Date();
  }

  checkCapacity() {
    const filter = {
      bk_cw_id: +this.activeRoute.snapshot.params["cw_id"],
      bk_date: this.bookingDate.getValue(),
    };

    const sqltypes = {
      bk_date: 91,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];
    this.service
      .query(filter, columns, "booking", sqltypes)
      .subscribe((resp) => {
        if (resp.code === 0) {
          console.log("Llego algo");
        } else {
          console.log("NO Llego ");
        }
      });
  }
}

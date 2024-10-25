import { Component, ViewChild } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import {
  DialogService,
  OButtonComponent,
  ODateInputComponent,
  OFormComponent,
  OIntegerInputComponent,
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
    private activeRoute: ActivatedRoute,
    protected dialogService: DialogService
  ) {}


  @ViewChild("sites") coworkingsSites: OIntegerInputComponent;
  @ViewChild("date") bookingDate: ODateInputComponent;
  @ViewChild("realCapacity") realCapacity: OIntegerInputComponent;
  @ViewChild("bookingButton") bookingButton: OButtonComponent;


  plazasOcupadas: number;

  currentDate() {
    return new Date();
  }

  checkCapacity() {
    const filter = {
      bk_cw_id: +this.activeRoute.snapshot.params["cw_id"],
      bk_date: this.bookingDate.getValue(),
      bk_state: true,
    };

    const sqltypes = {
      bk_date: 91,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];
    this.service
      .query(filter, columns, "totalBookingsByDate", sqltypes)
      .subscribe((resp) => {
        if (resp.code === 0) {
          //this.plazasOcupadas = resp.data.length ? resp.data.length : 0;
          this.plazasOcupadas = resp.data[0]["plazasocupadas"];
          this.realCapacity.setValue(
            this.coworkingsSites.getValue() - this.plazasOcupadas
          );
          if (this.realCapacity.getValue() < 1) {
            this.bookingButton.visible = false;
          } else {
            this.bookingButton.visible = true;
          }
        } else {
          alert("NO hay plazas")
        }
      });
  }

  showConfirm(evt: any) {
    if (this.dialogService) {
      this.dialogService.confirm('Confirm dialog title', 'Do you really want to accept?');
      this.dialogService.dialogRef.afterClosed().subscribe( result => {
        if(result) {
          // Actions on confirmation
          console.log('Confirmado')
        } else {
          // Actions on cancellation
          console.log('No confirmado')
        }
      })
    }
  }
}

import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  DialogService,
  OntimizeService,
  OSnackBarConfig,
  OTableComponent,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";
import { BookingRateComponent } from "../booking-rate/booking-rate.component";

@Component({
  selector: "app-bookings-home",
  templateUrl: "./bookings-home.component.html",
  styleUrls: ["./bookings-home.component.css"],
})
export class BookingsHomeComponent {
  public dateStart = this.utils.dateStartFunction;
  public dateEnd = this.utils.dateEndFunction;

  @ViewChild("table") table: OTableComponent;


  constructor(
    private router: Router,
    private service: OntimizeService,
    private utils: UtilsService,
    private dialogService: DialogService,
    private translate: OTranslateService,
    private snackBarService: SnackBarService,
    protected dialog: MatDialog,
  ) { }

  // toCoworkingDetail(event) {
  //   console.log(event.row.bk_cw_id);
  //   this.router.navigate(["/main/coworkings/" + event.row.bk_cw_id]);
  // }

  toCoworkingDetail(event) {
    if (event.columnName == "rate") {
      console.log("ABRIR MODAL");

      this.openValoration(event);
    } else if (event.columnName == "cancelCWbooking") {
      this.cancelBooking(event);
    } else {
      this.router.navigate(["/main/coworkings/" + event.row.bk_cw_id]);
    }
  }



  cancelBooking(evt: any) {
    var confirmMessageTitle = this.translate.get("CANCEL");
    var confirmMessageBody = this.translate.get("VERIFY_CANCEL_BOOKING");
    var cancelledMessage = this.translate.get("CANCELLED_BOOKING")

    if (evt["bk_state"]) {
      if (this.dialogService) {
        this.dialogService.confirm(confirmMessageTitle, confirmMessageBody);
        this.dialogService.dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.updateState(evt);
            this.table.reloadData();
          }
        });
      }
    } else {
      this.showAvailableToast(cancelledMessage);
    }
  }

  updateState(id: any) {
    const filter = {
      bk_state: false,
    };

    const keyMap = { bk_id: id };
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    this.service.update(keyMap, filter, "booking").subscribe((data) => {
      this.showAvailableToast("CANCEL_CW_BOOKING_CONFIRMED");
    });
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage = mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 3000,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  openValoration(data): void {
    console.log(data)
    console.log("name:" + data.row.cw_name);
    console.log("rate:" + data.row.bkr_ratio);
    console.log("bk_id:" + data.row.bk_id);
    console.log("cw_id: " + data.row.bk_cw_id);
    console.log("_____________________________________");

    this.dialog.open(BookingRateComponent, {
      height: '37%',
      width: '40%',
      data: {
        name: data.row.cw_name,
        rate: data.row.bkr_ratio,
        bk_id: data.row.bk_id,
        cw_id: data.row.bk_cw_id
      }
    })
  }

}

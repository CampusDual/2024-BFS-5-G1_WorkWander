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

  toCoworkingDetail(event) {
    if (event.columnName == "rate") {
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
    var cancelledMessage = this.translate.get("CANCELLED_BOOKING");
    var cancelledMessage2 = this.translate.get("CANCELLED_BOOKING2");

    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    var startDate = new Date(evt["dates"][0]);
    startDate.setHours(0, 0, 0, 0);
    var endDate = new Date(evt["dates"][evt["dates"].length - 1]);
    endDate.setHours(0, 0, 0, 0);

    if (evt["bk_state"]) {
      if (currentDate < startDate) {
        if (this.dialogService) {
          this.dialogService.confirm(confirmMessageTitle, confirmMessageBody);
          this.dialogService.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.updateState(evt["bk_id"]);
              this.table.reloadData();
            }
          });
        }
      } else {
        this.showAvailableToast(cancelledMessage2);
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

  openValoration(evt): void {

    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    var startDate = new Date(evt.row.dates[0]);
    startDate.setHours(0, 0, 0, 0);
    var endDate = new Date(evt.row.dates[(evt.row.dates).length - 1]);
    endDate.setHours(0, 0, 0, 0);

    if (evt.row.bk_state && evt.row.bkr_ratio == undefined) {
      if (currentDate > endDate) {
        this.dialog.open(BookingRateComponent, {
          height: '50%',
          width: '40%',
          data: {
            name: evt.row.cw_name,
            rate: evt.row.bkr_ratio,
            bk_id: evt.row.bk_id,
            cw_id: evt.row.bk_cw_id,
            usr_id: evt.row.bk_usr_id
          }
        })
      }
    }
  }

}

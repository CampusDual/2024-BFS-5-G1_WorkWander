import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  DialogService,
  OIntegerInputComponent,
  OntimizeService,
  OSnackBarConfig,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-bookings-home",
  templateUrl: "./bookings-home.component.html",
  styleUrls: ["./bookings-home.component.css"],
})
export class BookingsHomeComponent {
  public dateStart = this.utils.dateStartFunction;
  public dateEnd = this.utils.dateEndFunction;

  constructor(
    private router: Router,
    private service: OntimizeService,
    private utils: UtilsService,
    private dialogService: DialogService,
    private translate: OTranslateService,
    private snackBarService: SnackBarService
  ) {}

  toCoworkingDetail(event) {
    console.log(event.row.bk_cw_id);
    this.router.navigate(["/main/coworkings/" + event.row.bk_cw_id]);
  }

  cancelBooking(evt: any) {
    var confirmMessageTitle = this.translate.get("CANCEL");
    var confirmMessageBody = this.translate.get("CANCEL_BOOKING");

    if (this.dialogService) {
      this.dialogService.confirm(confirmMessageTitle, confirmMessageBody);
      this.dialogService.dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateState(evt["bk_id"]);
          
        }
      });
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
      milliseconds: 7500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }
}

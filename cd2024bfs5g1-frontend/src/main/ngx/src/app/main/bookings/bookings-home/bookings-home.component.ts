import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DialogService, OTranslateService } from "ontimize-web-ngx";
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
    private utils: UtilsService,
    private dialogService: DialogService,
    private translate: OTranslateService
  ) {}

  toCoworkingDetail(event) {
    console.log(event.row.bk_cw_id);
    this.router.navigate(["/main/coworkings/" + event.row.bk_cw_id]);
  }

  cancelBooking(evt: any) {
    var confirmMessageTitle = this.translate.get("CANCEL_BOOKING")

    if (this.dialogService) {
      this.dialogService.confirm(
        confirmMessageTitle,
        ''
      );
    }
  }
}

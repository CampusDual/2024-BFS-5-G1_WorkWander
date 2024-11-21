import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-bookings-home",
  templateUrl: "./bookings-home.component.html",
  styleUrls: ["./bookings-home.component.css"],
})
export class BookingsHomeComponent {
  public dateStart = this.utils.dateStartFunction;
  public dateEnd = this.utils.dateEndFunction;

  constructor(private router: Router, private utils: UtilsService) {}
  toCoworkingDetail(event) {
    console.log(event.row.bk_cw_id);
    this.router.navigate(["/main/coworkings/" + event.row.bk_cw_id]);
  }
}

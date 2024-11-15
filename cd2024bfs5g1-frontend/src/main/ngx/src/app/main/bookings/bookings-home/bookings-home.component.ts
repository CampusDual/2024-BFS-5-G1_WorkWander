import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  dateEndFunction,
  dateStartFunction,
} from "src/app/shared/shared.module";

@Component({
  selector: "app-bookings-home",
  templateUrl: "./bookings-home.component.html",
  styleUrls: ["./bookings-home.component.css"],
})
export class BookingsHomeComponent {
  public dateStart = dateStartFunction;
  public dateEnd = dateEndFunction;

  constructor(
    private router: Router
  ){}
  toCoworkingDetail(event){
    console.log(event.row.bk_cw_id)
    this.router.navigate(["/main/coworkings/:"+event.row.bk_cw_id.toString()]);
  }

}

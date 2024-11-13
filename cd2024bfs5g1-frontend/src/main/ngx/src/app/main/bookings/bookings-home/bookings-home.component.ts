import { Component } from "@angular/core";
import { dateEndFunction, dateStartFunction } from 'src/app/shared/shared.module';


@Component({
  selector: "app-bookings-home",
  templateUrl: "./bookings-home.component.html",
  styleUrls: ["./bookings-home.component.css"],
})
export class BookingsHomeComponent {
  public dateStart = dateStartFunction
  public dateEnd = dateEndFunction
}

import { Component, ViewChild } from "@angular/core";
import { ODateInputComponent, OTableColumn, OTableColumnComponent } from "ontimize-web-ngx";
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

import { Component, ViewChild } from "@angular/core";
import { ODateInputComponent, OTableColumn, OTableColumnComponent } from "ontimize-web-ngx";

@Component({
  selector: "app-bookings-home",
  templateUrl: "./bookings-home.component.html",
  styleUrls: ["./bookings-home.component.css"],
})
export class BookingsHomeComponent {



  @ViewChild("dates") bookingDate: OTableColumnComponent;

  private arrayDates: OTableColumnComponent;
  private dates: [];

  showStartDate(){
    return this.arrayDates[0];
  }
  showEndDate(){
    return this.arrayDates[length-1];
  }

}

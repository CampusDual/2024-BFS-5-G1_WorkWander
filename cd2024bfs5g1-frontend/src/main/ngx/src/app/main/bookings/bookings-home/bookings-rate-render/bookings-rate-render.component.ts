import { Component, Injector, TemplateRef, ViewChild } from "@angular/core";
import { OBaseTableCellRenderer } from "ontimize-web-ngx";

@Component({
  selector: "app-bookings-rate-render",
  templateUrl: "./bookings-rate-render.component.html",
  styleUrls: ["./bookings-rate-render.component.css"],
})
export class BookingsRateRenderComponent extends OBaseTableCellRenderer{
  
  @ViewChild("rate", { read: TemplateRef, static: false })
  public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCellData(cellvalue: any, rowvalue?: Array<any>): string {
    return "";
  }
}

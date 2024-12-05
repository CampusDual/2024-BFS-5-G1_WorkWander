import { Component, Injector, TemplateRef, ViewChild } from "@angular/core";
import { OBaseTableCellRenderer } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-bookings-state-render",
  templateUrl: "./bookings-state-render.component.html",
  styleUrls: ["./bookings-state-render.component.css"],
})
export class BookingsStateRenderComponent extends OBaseTableCellRenderer {
  @ViewChild("templateref", { read: TemplateRef, static: false })
  public templateref: TemplateRef<any>;

  constructor(
    protected injector: Injector,
    protected utilsService: UtilsService
  ) {
    super(injector);
  }

  getCellData(cellvalue: any, rowvalue?: Array<any>): string {
    return this.utilsService.calculateState( rowvalue);
  }
}

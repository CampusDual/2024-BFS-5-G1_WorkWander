import { Component, Injector, TemplateRef, ViewChild } from "@angular/core";
import { OBaseTableCellRenderer } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-bookings-rate-render",
  templateUrl: "./bookings-rate-render.component.html",
  styleUrls: ["./bookings-rate-render.component.css"],
})
export class BookingsRateRenderComponent extends OBaseTableCellRenderer {
  @ViewChild("rate", { read: TemplateRef, static: false })
  public templateref: TemplateRef<any>;
  public utilsService: UtilsService;

  constructor(protected injector: Injector, utilsService: UtilsService) {
    super(injector);
  }

  checkstate(cellvalue, rowvalue): boolean {
    const estadoString: string = this.utilsService.calculateState(
      cellvalue,
      rowvalue
    );
    var estadoBoolean: boolean = false;
    if (estadoString === "Finalizada") {
      estadoBoolean = true;
    } else {
      estadoBoolean = false;
    }
    return estadoBoolean;
  }
}

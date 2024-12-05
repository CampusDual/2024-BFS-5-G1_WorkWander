import { Component, Injector, TemplateRef, ViewChild } from "@angular/core";
import { OBaseTableCellRenderer } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-bookings-cancel-render",
  templateUrl: "./bookings-cancel-render.component.html",
  styleUrls: ["./bookings-cancel-render.component.css"],
})
export class BookingsCancelRenderComponent extends OBaseTableCellRenderer {
  @ViewChild("cancelCWbooking", { read: TemplateRef, static: false })
  public templateref: TemplateRef<any>;
  constructor(
    protected injector: Injector,
    protected utilsService: UtilsService
  ) {
    super(injector);
  }

  checkCancelState(cellvalue, rowvalue): boolean {
    const estadoString: string = this.utilsService.calculateState(
      rowvalue
    );
    var estadoBoolean: boolean = false;
    if (estadoString === "Pendiente") {
      estadoBoolean = true;
    } else {
      estadoBoolean = false;
    }
    return estadoBoolean;
  }

  pasarAlHome(){
    console.log("hola")
  }

}

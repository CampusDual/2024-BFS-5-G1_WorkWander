import { Component, Injector, TemplateRef, ViewChild } from "@angular/core";
import { OBaseTableCellRenderer, OTranslateModule } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";
import { MatDialog } from "@angular/material/dialog";
import { QrDialogComponent } from "../qr-dialog/qr-dialog.component";
import { OTranslateService } from "ontimize-web-ngx";

@Component({
  selector: "app-bookings-access-qr",
  templateUrl: "./bookings-access-qr.component.html",
  styleUrls: ["./bookings-access-qr.component.css"],
})
export class BookingsAccessQrComponent extends OBaseTableCellRenderer {
  @ViewChild("qrTemplate", { read: TemplateRef, static: true })
  public templateref: TemplateRef<any>;

  constructor(
    protected injector: Injector,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private translate: OTranslateModule
  ) {
    super(injector);
  }

  public showQRDialog(rowData: any): void {
    this.dialog.open(QrDialogComponent, { data: rowData });
  }

  public isBookingActive(rowData: any): boolean {
    if (!rowData) return false;
    const estado = this.utilsService.calculateState(rowData);
    return estado === "Pendiente" || estado === "En curso";
  }
}

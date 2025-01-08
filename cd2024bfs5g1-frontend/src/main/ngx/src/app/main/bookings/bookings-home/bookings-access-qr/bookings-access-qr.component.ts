import {
  Component,
  Injector,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,

} from "@angular/core";
import { DialogService, OBaseTableCellRenderer } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";
import { SafeUrl } from "@angular/platform-browser";
import { QRCodeComponent } from "angularx-qrcode";
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

  public qrCodeData: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    protected injector: Injector,
    private dialogService: DialogService,
    private utilsService: UtilsService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private translate: OTranslateService,
  ) {
    super(injector);
  }

  public showQRDialog(rowData: any): void {
    this.dialog.open(QrDialogComponent, { data: rowData });
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    setTimeout(() => {
      this.cd.detectChanges();
    });
  }

  public isBookingActive(rowData: any): boolean {
    if (!rowData) return false;

    const estado = this.utilsService.calculateState(rowData);
    return estado === "Pendiente" || estado === "En curso";
  }
}

import { Component, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SafeUrl } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { OTranslateService } from "ontimize-web-ngx";

@Component({
  selector: "app-qr-dialog",
  templateUrl: "./qr-dialog.component.html",
  styleUrls: ["./qr-dialog.component.scss"],
  providers: [DatePipe],
})
export class QrDialogComponent {
  public qrCodeData: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private translateService: OTranslateService
  ) {
    this.qrCodeData = this.buildQrData(data);
  }

  public getFileName(): string {
    const coworkingName = this.data.cw_name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "");

    const formattedName = coworkingName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return `Entrada para ${formattedName}`;
  }

  public onChangeURL(url: SafeUrl): void {
    this.qrCodeDownloadLink = url;

    setTimeout(() => {
      this.cd.detectChanges();
    });
  }

  private buildQrData(data: any): string {
    const coworkingName = data.cw_name;
    const startDate = this.formatDate(new Date(data.date_start));
    const endDate = this.formatDate(new Date(data.date_end));

    const labelReserva = this.translateService.get("BOOKING_QR");
    const labelInicio = this.translateService.get("START");
    const labelFin = this.translateService.get("END");

    return `${labelReserva} ${coworkingName}\n${labelInicio} ${startDate}\n${labelFin} ${endDate}`;
  }

  private formatDate(date: Date): string {
    return this.translateService.getCurrentLang() === "en"
      ? this.datePipe.transform(date, "MM/dd/yyyy") || ""
      : this.datePipe.transform(date, "dd/MM/yyyy") || "";
  }
}

// qr-dialog.component.ts
import { Component, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SafeUrl } from "@angular/platform-browser";
import { DatePipe } from "@angular/common"; // Importa el DatePipe

@Component({
  selector: "app-qr-dialog",
  templateUrl: "./qr-dialog.component.html",
  styleUrls: ["./qr-dialog.component.css"],
  providers: [DatePipe], // Provee el DatePipe en el componente
})
export class QrDialogComponent {
  public qrCodeData: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe // Inyecta el DatePipe
  ) {
    this.qrCodeData = this.buildQrData(data);
  }

  public onChangeURL(url: SafeUrl): void {
    this.qrCodeDownloadLink = url;

    setTimeout(() => {
      this.cd.detectChanges();
    });
  }

  private buildQrData(data: any): string {
    const coworkingName = data.cw_name || "Nombre del Coworking";
    const startDate = this.formatDate(new Date(data.date_start));
    const endDate = this.formatDate(new Date(data.date_end));

    return `Reserva en: ${coworkingName}\nInicio: ${startDate}\nFin: ${endDate}`;
  }

  private formatDate(date: Date): string {
    // Utiliza el DatePipe para formatear la fecha
    return this.datePipe.transform(date, "dd/MM/yyyy") || "";
  }
}

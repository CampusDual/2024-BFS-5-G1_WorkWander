import { Component, Inject, Input } from "@angular/core";
import { DialogService } from "ontimize-web-ngx";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-bookings-access-qr",
  templateUrl: "./bookings-access-qr.component.html",
  styleUrls: ["./bookings-access-qr.component.css"],
})
export class BookingsAccessQrComponent {
  @Input() bookingId: number;
  public qrData: string = "";

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    if (this.bookingId) {
      this.qrData = JSON.stringify({
        bookingId: this.bookingId,
        timestamp: new Date().getTime(),
      });
    }
  }

  public showQRDialog(): void {
    const dialogContent = `
      <div fxLayout="column" fxLayoutAlign="center center" style="padding: 24px">
        <qrcode
          [qrdata]="${this.qrData}"
          [width]="300"
          [errorCorrectionLevel]="'M'"
        ></qrcode>
        <span class="qr-info">${"SCAN_QR_MESSAGE"}</span>
      </div>
    `;

    this.dialogService.info("ACCESS_QR", dialogContent);
  }
}

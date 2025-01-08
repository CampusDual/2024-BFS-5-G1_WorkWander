import { Component, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-qr-dialog",
  templateUrl: "./qr-dialog.component.html",
  styleUrls: ["./qr-dialog.component.css"],
})
export class QrDialogComponent {
  public qrCodeData: string;
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {
    this.qrCodeData = JSON.stringify({
      coworkingName: data.cw_name,
      startDate: data.date_start,
      endDate: data.date_end,
    });
  }

  public onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    setTimeout(() => {
      this.cd.detectChanges();
    });
  }
}

import {
  Component,
  Inject,
  Injector,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import {
  OntimizeService,
  OSnackBarConfig,
  OTextareaInputComponent,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";
import { Rating } from "primeng/rating";
import { UserInfoService } from "src/app/shared/services/user-info.service";

@Component({
  selector: "app-booking-rate",
  templateUrl: "./booking-rate.component.html",
  styleUrls: ["./booking-rate.component.css"],
})
export class BookingRateComponent {
  @ViewChild("comment") comment: OTextareaInputComponent;
  @ViewChild("ratio") ratio: Rating;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected service: OntimizeService,
    private sanitizer: DomSanitizer,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<BookingRateComponent>,
    @Inject(OntimizeService) protected ratingService: OntimizeService,
    @Inject(UserInfoService) private userInfoService: UserInfoService,
    private injector: Injector,
    private translate: OTranslateService
  ) {}

  createValoration() {
    const filter = {
      id_bkr: this.data.bk_id,
      bkr_description: this.comment.getValue(),
      bkr_ratio: this.ratio.value,
      cw_id: this.data.cw_id,
      usr_id: this.data.usr_id,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookingsRate");
    this.service.configureService(conf);

    this.service.insert(filter, "bookingRate").subscribe((resp) => {
      this.showAvailableToast("COWORKING_VALORATION");
      this.dialogRef.close();
      window.location.reload();
    });
  }

  showAvailableToast(mensaje?: string) {
    const configuration: OSnackBarConfig = {
      milliseconds: 5000,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(mensaje, configuration);
  }
}

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DialogService, OFormComponent, OIntegerInputComponent, OntimizeService, OPermissions, OSnackBarConfig, OTranslateService, SnackBarService, Util } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";


@Component({
  selector: "app-events-detail",
  templateUrl: "./events-detail.component.html",
  styleUrls: ["./events-detail.component.css"],
})

export class EventsDetailComponent implements OnInit {

  buttonBooking!: boolean;
  bookingEvents: any = [];
  literalNumeroPlazas: string;
  numeroPlazas: string;
  literalPlazas: string;

  @ViewChild("form") form: OFormComponent;
  @ViewChild("bookingButton") reservationButton: OFormComponent;
  @ViewChild("id_event") id_event: OIntegerInputComponent;

  public hasImage: boolean = true;

  constructor(
    private service: OntimizeService,
    private activeRoute: ActivatedRoute,
    private translate: OTranslateService,
    private utils: UtilsService,
    private location: Location,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService,
    protected auth: AuthService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.buttonBooking = true;
    this.checkBookingEvent();
  }

  formatDate(rawDate: number): string {
    if (rawDate) {
      return this.utils.formatDate(rawDate);
    }
  }
  public initializeForm() {
    this.hasImage = this.form.getFieldValue('image_event') ? true : false;
  }


  formatTime(time: string): string {
    if (time != null || time != undefined) {
      return this.utils.formatTime(time);
    }
  }

  durationConvert(minutes: number): String {
    const DurationHours = this.translate.get("HOURS_MESSAGE");
    const DurationMinutes = this.translate.get("MINUTES_MESSAGE");
    const NoDuration = this.translate.get("NO_DURATION");
    var horas: number = 0;
    var minutosRestantes: number = 0;
    var tiempo: String = "";

    if (minutes == null) {
      tiempo = `${NoDuration}`;
    } else {
      if (minutes >= 60) {
        horas = Math.floor(minutes / 60);
        minutosRestantes = minutes % 60;
        tiempo = `${horas} ${DurationHours} ${minutosRestantes} ${DurationMinutes}`;
      } else {
        tiempo = `${minutes} ${DurationMinutes}`;
      }
    }
    return tiempo;
  }

  goBack(): void {
    this.location.back();
  }

  checkAuthStatus() {
    return !this.auth.isLoggedIn();
  }

  isInvalidButton() {
    return !this.buttonBooking;
  }

  showConfirm() {
    if (this.auth.isLoggedIn()) {
      const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
      const confirmMessage = this.translate.get("BOOKINGS_CONFIRMATION");
      this.dialogService.confirm(confirmMessageTitle, confirmMessage).then((result) => {
        if (result) {
          this.createBookingEvent();
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  createBookingEvent() {
    const filter = {
      bke_id_event: +this.form.getFieldValue('id_event'),
    };
    const conf = this.service.getDefaultServiceConfiguration('bookingEvents');
    this.service.configureService(conf);

    this.service.insert(filter, "bookingEvent").subscribe((resp) => {
      if (resp.code === 0) {
        this.showAvailableToast(resp.message);
        this.checkBookingEvent();
      }
    });
  }

  showAvailableToast(mensaje: string) {
    const availableMessage =
      this.translate.get(mensaje);
    const configuration: OSnackBarConfig = {
      milliseconds: 3500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  parsePermissions(attr: string): boolean {
    // if oattr in form, it can have permissions
    if (!this.form || !Util.isDefined(this.form.oattr)) {
      return;
    }
    const permissions: OPermissions =
      this.form.getFormComponentPermissions(attr);

    if (!Util.isDefined(permissions)) {
      return true;
    }
    return permissions.visible;
  }

  checkBookingEvent() {
    const filter = {
      id_event: +this.activeRoute.snapshot.params["id_event"],
    };

    const conf = this.service.getDefaultServiceConfiguration("bookingEvents");
    this.service.configureService(conf);
    const columns = [
      "availableEventBookings",
      "usedEventBookings",
      "totalEventBookings",
    ];
    let cantidadPlazasLibres: number = 0.00;

    this.service
      .query(filter, columns, "getEventDisponibility")
      .subscribe((resp) => {
        if (resp.code === 0) {
          this.bookingEvents = resp.data;

          if (this.bookingEvents.totalEventBookings > 0) {
            this.buttonBooking = true;
            cantidadPlazasLibres = this.bookingEvents.availableEventBookings / this.bookingEvents.totalEventBookings;
            this.literalNumeroPlazas = "BOOKINGS_LEFT"
            this.numeroPlazas = this.bookingEvents.availableEventBookings;

            switch (true) {
              case (cantidadPlazasLibres > 0.9):
                this.literalPlazas = "EVENT_DISPONIBILITY_GT_90";
                break;
              case (cantidadPlazasLibres > 0.65) && (cantidadPlazasLibres <= 0.9):
                this.literalPlazas = "EVENT_DISPONIBILITY_GT_65";
                break;
              case (cantidadPlazasLibres > 0.5) && (cantidadPlazasLibres <= 0.65):
                this.literalPlazas = "EVENT_DISPONIBILITY_GT_50";
                break;
              case (cantidadPlazasLibres > 0.3) && (cantidadPlazasLibres <= 0.5):
                this.literalPlazas = "EVENT_DISPONIBILITY_GT_30";
                break;
              case (cantidadPlazasLibres > 0) && (cantidadPlazasLibres <= 0.3):
                this.literalPlazas = "EVENT_DISPONIBILITY_GT_00";
                break;
              case (cantidadPlazasLibres == 0):
                this.buttonBooking = false;
                this.literalPlazas = "EVENT_DISPONIBILITY_EQ_00";
                break;
            }
          }
          return this.translate.get("SLOTS") + ": " + <string>this.bookingEvents.availableEventBookings;

        } else {
          this.buttonBooking = false;
          return this.translate.get("NO_BOOKING_ENABLED")
        }
      });
  }
  deleteLoader() {
    const borrar = document.querySelector('#borrar') as HTMLDivElement;
    if (borrar) {
      borrar.textContent = "";
    }
  }

  dataLoadedFunc() {
    this.deleteLoader();
    this.initializeForm();
  }

}


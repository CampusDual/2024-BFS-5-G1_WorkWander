import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { DialogService, AuthService, OFormComponent, OIntegerInputComponent, OntimizeService, OPermissions, OSnackBarConfig, OTextInputComponent, OTranslateService, SnackBarService, Util } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";
@Component({
  selector: "app-events-detail",
  templateUrl: "./events-detail.component.html",
  styleUrls: ["./events-detail.component.css"],
})

export class EventsDetailComponent implements OnInit {
  bookingEvents: any = [];
  literalNumeroPlazas: string;
  numeroPlazas: string;
  literalPlazas: string;

  @ViewChild("form") form: OFormComponent;
  @ViewChild("bookingButton") reservationButton: OFormComponent;
  @ViewChild("id_event") id_event: OIntegerInputComponent;
  auth: any;

  constructor(
    private service: OntimizeService,
    private activeRoute: ActivatedRoute,
    private translate: OTranslateService,
    private utils: UtilsService,
    private location: Location,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService,
    private authService: AuthService,
    protected router:Router
  ) { }

  ngOnInit() {
    this.checkBookingEvent();
  }

  formatDate(rawDate: number): string {
    if (rawDate) {
      return this.utils.formatDate(rawDate);
    }
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
    return !this.authService.isLoggedIn();
  }

  parsePermissions(attr: any): boolean {
    if (!this.form || !Util.isDefined(this.form.oattr)) {
      return ;
    }
    const permissions: OPermissions =
      this.form.getFormComponentPermissions(attr);
    if (!Util.isDefined(permissions)) {
      return true;
    }
    return permissions.enabled;
  }

  showConfirm() {
    if(this.auth.isLoggedIn()){
      const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
      const confirmMessage = this.translate.get("BOOKINGS_CONFIRMATION");
      this.dialogService.confirm(confirmMessageTitle, confirmMessage).then((result) => {
        if (result) {
          this.createBookingEvent();
        }
      });
    }else{
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
          console.log(this.translate.get("SLOTS"), this.bookingEvents.availableEventBookings);
          if (this.bookingEvents.totalEventBookings > 0) {

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
                this.literalPlazas = "EVENT_DISPONIBILITY_EQ_00";
                break;
            }
          }
          return this.translate.get("SLOTS") + ": " + <string>this.bookingEvents.availableEventBookings;

        } else {
          return this.translate.get("NO_BOOKING_ENABLED")
        }
      });
  }
}


import { Component, Inject, ViewChild } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import {
  AuthService,
  DialogService,
  OButtonComponent,
  OFormComponent,
  OImageComponent,
  OIntegerInputComponent,
  OntimizeService,
  OPermissions,
  OSnackBarConfig,
  OTextInputComponent,
  OTranslateService,
  SnackBarService,
  Util,
  ODateRangeInputComponent,
} from "ontimize-web-ngx";

@Component({
  selector: "app-coworkings-detail",
  templateUrl: "./coworkings-detail.component.html",
  styleUrls: ["./coworkings-detail.component.css"],
})
export class CoworkingsDetailComponent {
  constructor(
    private service: OntimizeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    protected dialogService: DialogService,
    protected snackBarService: SnackBarService,
    @Inject(AuthService) private authService: AuthService,
    private translate: OTranslateService
  ) {}

  @ViewChild("sites") coworkingsSites: OIntegerInputComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;
  @ViewChild("realCapacity") realCapacity: OIntegerInputComponent;
  @ViewChild("bookingButton") bookingButton: OButtonComponent;
  @ViewChild("name") coworkingName: OTextInputComponent;
  @ViewChild("form") form: OFormComponent;
  @ViewChild("image") image: OImageComponent;
  @ViewChild("id") idCoworking: OIntegerInputComponent;

  plazasOcupadas: number;
  public idiomaActual: string;
  public idioma: string;
  public serviceList = [];
  public dateArray = [];

  getName() {
    return this.coworkingName ? this.coworkingName.getValue() : "";
  }

  ngOnInit() {
    this.showServices();
  }

  currentDate() {
    return new Date();
  }

  setDates() {
    const startDate = new Date((this.bookingDate as any).value.value.startDate);
    const endDate = new Date((this.bookingDate as any).value.value.endDate);

    this.dateArray[0] = startDate;
    this.dateArray[1] = endDate;

    this.checkCapacity()
      .then((funciona) => {
        if (funciona) {
          this.bookingButton.enabled = true;
        } else {
          this.bookingButton.enabled = false;
        }
      })
      .catch((error) => {
        console.error("Error al consultar capacidad:", error);
      });
  }

  checkCapacity(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const filter = {
        bk_cw_id: this.idCoworking.getValue(),
        bk_date: this.dateArray,
        bk_state: true,
      };
      const sqltypes = {
        bk_date: 91,
      };
      const conf = this.service.getDefaultServiceConfiguration("bookings");
      this.service.configureService(conf);
      const columns = ["bk_id"];

      this.service.query(filter, columns, "getDatesDisponibility").subscribe(
        (resp) => {
          const data = resp.data.data;
          console.log(data);
          const fechasDisponibles = Object.values(data).every(
            (disponible: boolean) => disponible === true
          );
          if (fechasDisponibles) {
            this.showAvailableToast("PLAZAS_DISPONIBLES"); // Mostrar mensaje de plazas disponibles
            resolve(true);
          } else {
            // Mostrar fechas que no están disponibles y guardarlas en un array
            const fechasNoDisponibles = Object.entries(data)
              .filter(([fecha, disponible]) => disponible === false)
              .map(([fecha]) => new Date(fecha));

            const fechasFormateadas = fechasNoDisponibles.map((fecha) =>
              this.changeFormatDate(fecha.getTime(), this.idioma)
            );

            const mensaje = `${(
              "NO_PLAZAS_DISPONIBLES"
            )}:\n - ${fechasFormateadas.join("\n - ")}`;
            this.showAvailableToast(mensaje);
            resolve(false);
          }
        },
        (error) => {
          console.error("Error al consultar capacidad:", error);
          reject(error);
        }
      );
    });
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage =
      mensaje || this.translate.get("PLAZAS_DISPONIBLES");
    const configuration: OSnackBarConfig = {
      milliseconds: 2000,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  changeFormatDate(milis: number, idioma: string) {
    const fecha = new Date(milis);

    let fechaFormateada;

    fechaFormateada = new Intl.DateTimeFormat(idioma).format(fecha);

    return fechaFormateada;
  }

  showConfirm(evt: any) {
    this.idiomaActual = this.translate.getCurrentLang();
    this.idiomaActual === "es"
      ? (this.idioma = "es-ES")
      : (this.idioma = "en-US");
    for (const date of this.dateArray) {
      this.bookingDate = date;
      const rawDate = this.bookingDate.getValue();
      const fechaBien = this.changeFormatDate(rawDate, this.idioma);
      const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
      const confirmMessageBody = this.translate.get("BOOKINGS_INSERT2");
      const confirmMessageBody2 = this.translate.get("BOOKINGS_INSERT3");
      const nologedMessageTitle = this.translate.get("BOOKINGS_NO_LOGED");
      const nologedMessageBody = this.translate.get("BOOKINGS_NO_LOGED2");

      if (this.authService.isLoggedIn()) {
        if (this.dialogService) {
          this.dialogService.confirm(
            confirmMessageTitle,
            `${confirmMessageBody}  ${fechaBien} ${confirmMessageBody2} ${this.coworkingName.getValue()} ?`
          );
          this.dialogService.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.createBooking();
            }
          });
        }
      } else {
        this.router.navigate(["/login"]);
      }
    }
  }

  createBooking() {
    const filter = {
      bk_cw_id: +this.idCoworking.getValue(),
      bk_date: this.bookingDate.getValue() + 3600000,
      bk_state: true,
    };

    const sqltypes = {
      bk_date: 91,
    };

    //Llaman al servicio del enpoint /bookings
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);

    this.service.insert(filter, "booking", sqltypes).subscribe((resp) => {
      if (resp.code === 0) {
        this.checkCapacity();
        this.showToastMessage();
      }
    });
  }

  showToastMessage() {
    const confirmedMessage = this.translate.get("BOOKINGS_CONFIRMED");

    // SnackBar configuration
    const configuration: OSnackBarConfig = {
      milliseconds: 2000,
      icon: "check_circle",
      iconPosition: "left",
    };

    // Simple message with icon on the left and action
    this.snackBarService.open(confirmedMessage, configuration);
  }

  checkAuthStatus() {
    return !this.authService.isLoggedIn();
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

  showServices(): any {
    const filter = {
      cw_id: +this.activeRoute.snapshot.params["cw_id"],
    };
    const conf = this.service.getDefaultServiceConfiguration("cw_services");
    this.service.configureService(conf);
    const columns = ["srv_name"];
    return this.service
      .query(filter, columns, "servicePerCoworking")
      .subscribe((resp) => {
        this.serviceList = resp.data;
      });
  }
}

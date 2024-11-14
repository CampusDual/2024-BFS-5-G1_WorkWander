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
  /**
   * Checks the capacity availability for a coworking space.
   *
   * This method creates a filter based on the coworking ID, date array, and state,
   * then queries the service to check for available dates. If all dates are available,
   * it shows a toast message indicating availability and resolves the promise with `true`.
   * If some dates are not available, it formats the unavailable dates, shows a toast message
   * with the unavailable dates, and resolves the promise with `false`.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if all dates are available,
   *                             or `false` if some dates are not available.
   */
  checkCapacity(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Crear un filtro para la consulta
      const filter = {
        bk_cw_id: this.idCoworking.getValue(), // Obtener el ID del coworking
        bk_date: this.dateArray, // Array de fechas
        bk_state: true, // Estado de la reserva
      };
      // Definir tipos SQL para la consulta
      const sqltypes = {
        bk_date: 91, // Tipo SQL para la fecha
      };
      // Obtener la configuración del servicio
      const conf = this.service.getDefaultServiceConfiguration("bookings");
      this.service.configureService(conf); // Configurar el servicio con la configuración obtenida
      const columns = ["bk_id"]; // Columnas a consultar

      // Realizar la consulta al servicio
      this.service.query(filter, columns, "getDatesDisponibility").subscribe(
        (resp) => {
          const data = resp.data.data; // Obtener los datos de la respuesta
          console.log(data);
          // Verificar si todas las fechas están disponibles
          const fechasDisponibles = Object.values(data).every(
            (disponible: boolean) => disponible === true
          );
          if (fechasDisponibles) {
            // Mostrar un mensaje de disponibilidad
            this.showAvailableToast(this.translate.get("PLAZAS_DISPONIBLES"));
            resolve(true); // Resolver la promesa con true
          } else {
            // Obtener las fechas no disponibles
            const fechasNoDisponibles = Object.entries(data)
              .filter(([fecha, disponible]) => disponible === false)
              .map(([fecha]) => new Date(fecha));

            // Formatear las fechas no disponibles
            const fechasFormateadas = fechasNoDisponibles.map((fecha) =>
              this.changeFormatDate(fecha.getTime(), this.idioma)
            );

            // Crear un mensaje con las fechas no disponibles
            const mensaje = `${this.translate.get(
              "NO_PLAZAS_DISPONIBLES"
            )}:\n - ${fechasFormateadas.join("\n - ")}`;
            this.showAvailableToast(mensaje); // Mostrar el mensaje
            resolve(false); // Resolver la promesa con false
          }
        },
        (error) => {
          console.error("Error al consultar capacidad:", error); // Manejar el error
          reject(error); // Rechazar la promesa con el error
        }
      );
    });
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage = mensaje || this.translate.get("PLAZAS_DISPONIBLES");
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

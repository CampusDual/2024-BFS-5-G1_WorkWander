import { DecimalPipe, Location } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AuthService,
  DialogService,
  OButtonComponent,
  OFormComponent,
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
import { UtilsService } from "src/app/shared/services/utils.service";
import { OMapComponent } from "ontimize-web-ngx-map";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-coworkings-detail",
  templateUrl: "./coworkings-detail.component.html",
  styleUrls: ["./coworkings-detail.component.css"],
})
export class CoworkingsDetailComponent implements OnInit {
  events: any = [];
  responsiveOptions!: any;
  constructor(
    private service: OntimizeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    protected dialogService: DialogService,
    protected snackBarService: SnackBarService,
    @Inject(AuthService) private authService: AuthService,
    private translate: OTranslateService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.responsiveOptions = [
      {
        breakpoint: "1024px",
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: "768px",
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: "560px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  @ViewChild("sites") coworkingsSites: OIntegerInputComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;
  @ViewChild("realCapacity") realCapacity: OIntegerInputComponent;
  @ViewChild("bookingButton") bookingButton: OButtonComponent;
  @ViewChild("name") coworkingName: OTextInputComponent;
  @ViewChild("form") form: OFormComponent;
  @ViewChild("id") idCoworking: OIntegerInputComponent;
  @ViewChild('formAverage', { static: true }) formAverage!: OFormComponent; // Garantiza que esta propiedad no será undefined al usarla.
  @ViewChild("coworking_map") coworking_map: OMapComponent;
  @ViewChild("cw_city") cw_city: OTextInputComponent;
  @ViewChild("cw_address") cw_address: OTextInputComponent;

  plazasOcupadas: number;
  public idiomaActual: string;
  public idioma: string;
  public serviceList = [];
  public dateArray = [];
  public dateArrayF = [];
  leafletMap: any;
  // Formatea los decimales del precio y añade simbolo de euro en las card de coworking
  public formatPrice(price: string): string {
    const price_ = parseFloat(price);
    let [integerPart, decimalPart] = price_.toFixed(2).split(".");
    if (decimalPart == "") {
      decimalPart = "00";
    }
    return `${integerPart},<span class="">${decimalPart}</span> €`;
  }

  getName() {
    return this.coworkingName ? this.coworkingName.getValue() : "";
  }

  ngOnInit() {
    this.leafletMap = this.coworking_map.getMapService().getMap();
  }

  iniciarPantalla(idLocation: number, city: string, address: string, lat: number, lon: number) {
    this.showEvents(idLocation);
    this.leafletMap = this.coworking_map.getMapService().getMap();
    if (lat === undefined && lon === undefined) {
      this.mapaShow(city, address);
    } else {
      this.updateMapAndMarker(`${lat};${lon}`, 16, this.coworkingName.getValue());
    }
  }

  currentDate() {
    let date = new Date();
    date.setHours(0, 0, 0, 0)

    return date;
  }

  showEvents(cw_location: number): void {
    if (cw_location != undefined) {
      let date = new Date();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let day = date.getDate();
      let m = month < 10 ? "0" + month.toString() : month.toString()
      let d = day < 10 ? "0" + day.toString() : day.toString()
      let now = `${year}-${m}-${d}`;
      const filter = {
        "@basic_expression": {
          lop: {
            lop: "locality",
            op: "=",
            rop: cw_location,
          },
          op: "AND",
          rop: {
            lop: "date_event",
            op: ">=",
            rop: now,
          },
        },
      };
      let sqltypes = {
        date_event: 91,
      };
      const conf = this.service.getDefaultServiceConfiguration("events");
      this.service.configureService(conf);
      const columns = [
        "id_event",
        "name",
        "description",
        "date_event",
        "hour_event",
        "address",
        "location",
        "bookings",
        "usr_id",
        "duration",
        "image_event",
      ];
      this.events = [];
      this.service
        .query(filter, columns, "event", sqltypes)
        .subscribe((resp) => {
          if (resp.code === 0 && resp.data.length > 0) {
            this.events = resp.data;
            this.events.sort(function (a: any, b: any) {
              return a.date_event - b.date_event;
            });
          }
        });
    }
  }

  /**
   * Método para transformar la imagen desde la BBDD
   * @param base64
   * @returns la imagen almacenada o la imagen por defecto
   */
  public getImageSrc(base64: any): any {
    return base64
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:image/*;base64," + base64
      )
      : "./assets/images/event-default.jpg";
  }

  /**
   * Método para transformar la fecha en función del idioma
   * Usa el servicio UtilsService en shared
   * @param date
   * @returns la fecha formateada como string
   */
  dateTransform(date: number): string {
    return this.utils.formatShortDate(date);
  }

  /**
   * Método para transformar la hora en hh:mm
   * @param time
   * @returns la hora formateada en hh:mm
   */
  timeTransform(time: any): string {
    return this.utils.formatTime(time);
  }

  /**
   * Método que permite navegar desde el evento seleccionado
   * dentro del coworking hasta su detalle, en events-detail
   * @param id_event
   */
  goEvent(id_event: number): void {
    //Navegamos hacia main/coworkings, definido en coworkings-routing-module
    this.router.navigate(
      ["main/coworkings/" + this.idCoworking + "/" + id_event],
      { queryParams: { isdetail: true } }
    );
  }

  setDates() {
    const startDate = new Date(
      (this.bookingDate as any).value.value.startDate
    ).toLocaleString("en-CA");
    const endDate = new Date(
      (this.bookingDate as any).value.value.endDate
    ).toLocaleString("en-CA");

    this.dateArray[0] = startDate;
    this.dateArray[1] = endDate;

    const filter = {
      bk_cw_id: this.idCoworking.getValue(),
      bk_date: this.dateArray,
      bk_state: true,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];

    this.service.query(filter, columns, "getDatesDisponibility").subscribe(
      (resp) => {
        const data = resp.data.data;
        const fechasDisponibles = Object.values(data).every(
          (disponible: boolean) => disponible === true
        );
        if (fechasDisponibles) {
          const fechasDisponibles = Object.entries(data)
            .filter(([fecha, disponible]) => disponible === true)
            .map(([fecha]) => new Date(fecha));
          this.dateArray = fechasDisponibles;
          this.showAvailableToast(this.translate.get("PLAZAS_DISPONIBLES"));
          this.bookingButton.enabled = true;
        } else {
          const fechasNoDisponibles = Object.entries(data)
            .filter(([fecha, disponible]) => disponible === false)
            .map(([fecha]) => new Date(fecha));

          const fechasFormateadas = fechasNoDisponibles.map((fecha) =>
            this.changeFormatDate(fecha.getTime(), this.idioma)
          );

          const mensaje = `${this.translate.get(
            "NO_PLAZAS_DISPONIBLES"
          )}:\n - ${fechasFormateadas.join("\n - ")}`;
          this.showAvailableToast(mensaje);
          this.bookingButton.enabled = false;
        }
      },
      (error) => {
        console.error("Error al consultar capacidad:", error);
        this.bookingButton.enabled = false;
      }
    );
    this.dateArray.splice(0, this.dateArray.length);
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage =
      mensaje || this.translate.get("PLAZAS_DISPONIBLES");
    const configuration: OSnackBarConfig = {
      milliseconds: 7500,
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
    const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
    const confirmMessageBody = this.translate.get("BOOKINGS_INSERT2");
    const confirmMessageBody2 = this.translate.get("BOOKINGS_INSERT3");
    this.dateArrayF = this.dateArray.map((fecha) =>
      this.changeFormatDate(fecha.getTime(), this.idioma)
    );
    const startDate = this.dateArrayF[0];
    const endDate = this.dateArrayF[this.dateArrayF.length - 1];
    if (this.authService.isLoggedIn()) {
      if (this.dialogService) {
        if (startDate == endDate) {
          this.dialogService.confirm(
            confirmMessageTitle,
            `${confirmMessageBody}  ${this.dateArrayF
            } ${confirmMessageBody2} ${this.coworkingName.getValue()} ?`
          );
        } else {
          this.dialogService.confirm(
            confirmMessageTitle,
            `${confirmMessageBody}  ${startDate} - ${endDate} ${confirmMessageBody2} ${this.coworkingName.getValue()} ?`
          );
        }
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

  createBooking() {
    const filter = {
      bk_cw_id: +this.idCoworking.getValue(),
      bk_date: this.dateArray,
      bk_state: true,
    };

    const sqltypes = {
      bk_date: 91,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);

    this.service.insert(filter, "rangeBooking").subscribe((resp) => {
      if (resp.code === 0) {
        this.showAvailableToast("BOOKINGS_CONFIRMED");
        this.bookingButton.enabled = false;
        this.bookingDate.clearValue();
      }
    });
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

  calculateIcons(average: number) {
    const fullIcons = Math.floor(average); // Número de íconos completos
    const hasHalfIcon = average % 1 >= 0.5; // Determina si se necesita un medio ícono
    const totalIcons = 5; // Número máximo de íconos (por ejemplo, 5 estrellas)


    return {
      fullIcons,
      hasHalfIcon,

    };
  }

  /**
   * Obtiene la media desde el formulario.
   * @returns Número (media).
   */
  getAverage(): number {

    let media: number = Math.round((this.formAverage.getFieldValue('average_ratio')) * 10) / 10;

    return media;
  }

  serviceIcons = {
    additional_screen: "desktop_windows",
    vending_machine: "kitchen",
    coffee_bar: "local_cafe",
    water_dispenser: "local_drink",
    ergonomic_chair: "event_seat",
    parking: "local_parking",
  };

  goBack(): void {
    this.location.back();
  }

  // ---------------------- MAPA ----------------------
  async mapaShow(selectedCity: string, address: string): Promise<void> {
    const addressComplete = `${selectedCity}, ${address}`;
    const name = this.getName();

    try {
      const addressResults = await this.getCoordinates(addressComplete);
      if (addressResults) {
        this.updateMapAndMarker(addressResults, 16, name);
        return;
      }

      console.log("Dirección no válida, intentando con la ciudad seleccionada...");
      const cityResults = await this.getCoordinates(selectedCity);
      if (cityResults) {
        this.updateMapAndMarker(cityResults, 14, null);
      } else {
        console.error("No se pudo obtener coordenadas para la ciudad, seleccionando Madrid como centro del mapa...");
        this.updateMapAndMarker("40.416775;-3.703790", 6, null);

      }
    } catch (error) {
      console.error("Error al procesar la ubicación:", error);

    }
  }

  private async getCoordinates(location: string): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&countrycodes=es&format=json`;
      const response = await this.http.get<any>(url).toPromise();
      if (response?.length > 0) {
        const { lat, lon } = response[response.length - 1];
        return `${lat};${lon}`;
      } else {
      }
    } catch (error) {
      this.snackBar(`Error al consultar la API: ${error}`);
    }
    return null;
  }


  private updateMapAndMarker(
    coordinates: string,
    zoom: number,
    markerLabel: string | null) {
    const [lat, lon] = coordinates.split(';').map(Number);
    this.leafletMap.setView([+lat, +lon], zoom);
    if (markerLabel) {
      this.coworking_map.addMarker(
        'coworking_marker',           // id
        lat,                          // latitude
        lon,                          // longitude
        {},                           // options
        markerLabel,                         // popup
        false,                        // hidden
        true,                         // showInMenu
        markerLabel                          // menuLabel
      );
    }
  }
  private snackBar(message: string): void {
    this.snackBarService.open(message, {
      milliseconds: 5000,
      icon: 'error',
      iconPosition: 'left'
    });
  }
}

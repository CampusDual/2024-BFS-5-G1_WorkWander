import { Component, Inject, ViewChild } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import {
  AppConfig,
  AuthService,
  DialogService,
  OButtonComponent,
  ODateInputComponent,
  ODialogConfig,
  OFormComponent,
  OIntegerInputComponent,
  OntimizeService,
  OPermissions,
  OSnackBarConfig,
  OTextInputComponent,
  OTranslateService,
  SnackBarService,
  Util,
} from "ontimize-web-ngx";
import { SettingsAppearanceComponent } from "../../settings/appearance/appearance.component";

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
  @ViewChild("date") bookingDate: ODateInputComponent;
  @ViewChild("realCapacity") realCapacity: OIntegerInputComponent;
  @ViewChild("bookingButton") bookingButton: OButtonComponent;
  @ViewChild("name") coworkingName: OTextInputComponent;
  @ViewChild("form") form: OFormComponent;

  plazasOcupadas: number;
  public idiomaActual: string;
  public idioma: string;

  currentDate() {
    return new Date();
  }

  checkCapacity() {
    const filter = {
      bk_cw_id: +this.activeRoute.snapshot.params["cw_id"],
      bk_date: this.bookingDate.getValue()+3600000,
      bk_state: true,
    };

    const sqltypes = {
      bk_date: 91,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];
    this.service
      .query(filter, columns, "totalBookingsByDate", sqltypes)
      .subscribe((resp) => {
        if (resp.code === 0) {

          this.plazasOcupadas = resp.data[0]["plazasocupadas"];
          this.realCapacity.setValue(
            this.coworkingsSites.getValue() - this.plazasOcupadas
          );
          if (this.realCapacity.getValue() < 1) {
            this.bookingButton.enabled = false;
          } else {
            this.bookingButton.enabled = true;
          }
        } else {
          alert("NO hay plazas");
        }
      });
  }

  changeFormatDate(milis: number, idioma: string) {
    const fecha = new Date(milis);

    let fechaFormateada;

    fechaFormateada = new Intl.DateTimeFormat(idioma).format(fecha);

    return fechaFormateada;
  }

  showConfirm(evt: any) {
    const rawDate = this.bookingDate.getValue();

    this.idiomaActual = this.translate.getCurrentLang();
    this.idiomaActual === "es" ? (this.idioma = "es-ES") : (this.idioma = "en-US");
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
      this.dialogService.confirm(
        nologedMessageTitle,
        nologedMessageBody // No añade el boton cancelar al dialogo, o cambia el icono de alerta
      );

      this.dialogService.dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.router.navigate(["/login"]);
        }
      });
    }
  }

  createBooking() {
    const filter = {
      bk_cw_id: +this.activeRoute.snapshot.params["cw_id"],
      bk_date: this.bookingDate.getValue()+3600000,
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

    const confirmedMessage = this.translate.get('BOOKINGS_CONFIRMED');

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
}

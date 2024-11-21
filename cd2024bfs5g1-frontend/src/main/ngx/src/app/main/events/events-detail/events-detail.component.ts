import { Location } from '@angular/common';
import { Component, ViewChild } from "@angular/core";
import { DialogService, OFormComponent, OntimizeService, OSnackBarConfig, OTranslateService, SnackBarService } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-events-detail",
  templateUrl: "./events-detail.component.html",
  styleUrls: ["./events-detail.component.css"],
})
export class EventsDetailComponent {
  constructor(
    private translate: OTranslateService,
    private utils: UtilsService,
    private location: Location,
    private service: OntimizeService,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService
  ) { }

  @ViewChild("form") form: OFormComponent;
  public idiomaActual: string;
  public idioma: string;

  formatDate(rawDate: number): string {
    return this.utils.formatDate(rawDate);
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

  //---------------------------------
  showConfirm() {
    this.idiomaActual = this.translate.getCurrentLang();
    this.idiomaActual === "es"
      ? (this.idioma = "es-ES")
      : (this.idioma = "en-US");

    const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
    this.dialogService.confirm(confirmMessageTitle, '¿Confirma su asistencia al evento? 📆').then((result) => {
      if (result) {
        this.createBooking();
      }
    });

  }

  createBooking() {
    const filter = {
      bke_id_event: +this.form.getFieldValue('id_event'),
    };
    console.log(filter);

    const conf = this.service.getDefaultServiceConfiguration('booking_events'); // cambiar por el de eventos
    this.service.configureService(conf);

    this.service.insert(filter).subscribe((resp) => {
      if (resp.code === 0) {
        this.showAvailableToast("BOOKINGS_CONFIRMED");
      }
    });
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage =
      this.translate.get(mensaje);
    const configuration: OSnackBarConfig = {
      milliseconds: 7500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }
}


// Añadiremos un botón de Asistiré en el detalle del evento si quedan plazas disponibles.

// Cuando el usuario se inscriba, mostraremos un toast indicando Reserva confirmada.

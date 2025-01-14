import { Component, Injector, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  OFormComponent,
  OntimizeService,
  OSnackBarConfig,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";

@Component({
  selector: "app-events-edit",
  templateUrl: "./events-edit.component.html",
  styleUrls: ["./events-edit.component.css"],
})
export class EventsEditComponent {

  @ViewChild("form") form: OFormComponent;

  constructor(
    private router: Router,
    private translate: OTranslateService,
    private service: OntimizeService,
    protected snackBarService: SnackBarService,
    protected injector: Injector,
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  //Devuelve la fecha actual
  currentDate() {
    return new Date();
  }

  public onInsertSuccess(): void {
    console.log("Test");
    this.router.navigateByUrl("/main/myEvents")
  }

  public async save() {

    let hora = (this.form.getFieldValue('hour_event')).toString();
    let event = {};
    let hour_event;

    if (hora.includes(':')) {
      hour_event = this.form.getFieldValue("hour_event");
    } else {
      hour_event = new Date(
        this.form.getFieldValue("hour_event")
      ).toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    }

    event = {
      id_event: this.form.getFieldValue('id_event'),
      name: this.form.getFieldValue('name'),
      description: this.form.getFieldValue('description'),
      date_event: new Date(
        this.form.getFieldValue("date_event")
      ).toLocaleDateString("en-CA"),
      hour_event: hour_event,
      duration: +this.form.getFieldValue('duration'),
      bookings: +this.form.getFieldValue('bookings'),
      price: +this.form.getFieldValue('price'),
      locality: this.form.getFieldValue('locality'),
      address: this.form.getFieldValue('address'),
      image_event: this.form.getFieldValue('image_event')
    }

    this.plazasUsadas(event);

    this.form._clearAndCloseFormAfterInsert();
  }

  public update(event: any): void {

    const sqlTypes = {
      hour_event: 12,
      date_event: 91,
    };

    const keyMap = { id_event: this.form.getFieldValue('id_event') }
    const conf = this.service.getDefaultServiceConfiguration('events');
    this.service.configureService(conf);
    this.service.update(keyMap, event, 'myEvent', sqlTypes).subscribe(data => {
      this.showUpdatedToast('EVENT_UPDATED');
    });
  }

  plazasUsadas(event) {

    const filter = {
      id_event: this.form.getFieldValue('id_event'),
    };

    const conf = this.service.getDefaultServiceConfiguration("bookingEvents");
    this.service.configureService(conf);
    const columns = [
      "availableEventBookings",
      "usedEventBookings",
      "totalEventBookings",
    ];

    this.service
      .query(filter, columns, "getEventDisponibility")
      .subscribe((resp) => {

        if (this.form.getFieldValue('bookings') >= resp.data['usedEventBookings']) {
          this.update(event);
        } else {
          this.showWarningToast('EVENT_WITH_BOOKINGS');
        }

      });
  }

  isInvalidForm(): boolean {
    return !this.form || this.form.formGroup.invalid;
  }

  showUpdatedToast(mensaje?: string) {
    const availableMessage = mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 3000,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  public showWarningToast(message) {
    const availableMessage = message;
    const configuration: OSnackBarConfig = {
      milliseconds: 5000,
      icon: 'warning',
      iconPosition: 'left'
    };
    this.snackBarService.open(availableMessage, configuration);
  }
}

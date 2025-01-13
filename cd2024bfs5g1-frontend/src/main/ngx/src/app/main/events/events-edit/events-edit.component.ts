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

  // protected configureService() {
  //   const conf = this.service.getDefaultServiceConfiguration('events');
  //   this.service.configureService(conf);
  // }

  public onInsertSuccess(): void {
    console.log("Test");
    this.router.navigateByUrl("/main/myEvents")
  }

  public async save() {



    //Creamos un objeto evento
    const event = {
      id_event: this.form.getFieldValue('id_event'),
      name: this.form.getFieldValue('name'),
      description: this.form.getFieldValue('description'),
      date_event: new Date(
        this.form.getFieldValue("date_event")
      ).toLocaleDateString("en-CA"),
      hour_event: this.form.getFieldValue("hour_event"),
      duration: this.form.getFieldValue('duration'),
      bookings: +this.form.getFieldValue('bookings'),
      price: this.form.getFieldValue('price'),
      locality: this.form.getFieldValue('locality'),
      address: this.form.getFieldValue('address'),
      image_event: this.form.getFieldValue('image_event')
    }
    //Llamamos a la función para actualizar, enviando el objeto
    this.update(event);
    this.showUpdated();
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
      console.log(data);
    });
  }

  isInvalidForm(): boolean {
    return !this.form || this.form.formGroup.invalid;
  }

  public showUpdated() {
    const configuration: OSnackBarConfig = {
      milliseconds: 5000,
      icon: 'check_circle',
      iconPosition: 'left'
    };
    this.snackBarService.open(this.translate.get('EVENT_UPDATE'), configuration);
  }
}

import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  OFormComponent,
  OntimizeService,
  OSnackBarConfig,
  OTextInputComponent,
  OTimeInputComponent,
  SnackBarService,
} from "ontimize-web-ngx";

@Component({
  selector: "app-events-new",
  templateUrl: "./events-new.component.html",
  styleUrls: ["./events-new.component.css"],
})
export class EventsNewComponent {
  @ViewChild("nameInput") public nameCtrl: OTextInputComponent;
  @ViewChild("timeInput") public timeCtrl: OTimeInputComponent;
  @ViewChild("form") public formCtrl: OFormComponent;

  constructor(private router: Router, private service: OntimizeService, protected snackBarService: SnackBarService) {
    const conf = this.service.getDefaultServiceConfiguration("events");
    this.service.configureService(conf);

  }

  // Estas funciones están en desarrollo, están pensadas para comprobar que la fecha sea una fecha posterior al dia de hoy
  // y que no se meta un evento repetido

  // validateEvent() {
  //   const name = this.nameCtrl.getValue();
  //   const time = this.timeCtrl.getValue();
  //   console.log(name);
  //   console.log(time);
  //   console.log(this.timeCtrl);
  //   if ((name === undefined || name === null) || (time === undefined || time === null)) {
  //     this.formCtrl.showHeader = false;
  //   } else {
  //     const filter = { 'name': name, 'date_event': time};
  //     const columns = [ 'id_event' ];
  //     const sqltypes = { 'date_event': 93 };
  //     this.service.query(filter, columns, 'event', sqltypes).subscribe(resp => {
  //       if (resp.data && resp.data.lenght > 0) {
  //         alert('Evento ya existe');
  //         this.formCtrl.showHeader = false;
  //       } else {
  //         this.formCtrl.showHeader = true;
  //       }
  //     });
  //   }
  // }

  currentDate() {
    return new Date();
  }
 //Obtiene la hora actual del sistema en la zona horaria local del usuario.
 getValue() {
  console.log("Hora: ", new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
  createEvent() {
    this.router.navigate(["/main/myevents"]);
  }
  //Función que deshabilita el botón de guardar mientras no se introduzcan datos
  isInvalidForm(): boolean {
    return !this.formCtrl || this.formCtrl.formGroup.invalid;
  }

  //Función que limpia el formulario y redirige a myevents
  public cancel(){
    this.formCtrl.setInitialMode();
    this.router.navigateByUrl("/main/myevents")
  }

  //Recupera los datos del formalario de nuevo evento y llama a la función de insert
  public save(){
    const sqlTypes = {
      hour_event:12
    }

    const event = {
      name:this.formCtrl.getFieldValue('name'),
      description:this.formCtrl.getFieldValue('description'),
      date_event:new Date(this.formCtrl.getFieldValue('date_event')).toLocaleString(),
      hour_event:this.formCtrl.getFieldValue('hour_event'),
      address:this.formCtrl.getFieldValue('address'),
      locality:this.formCtrl.getFieldValue('locality'),
      bookings:this.formCtrl.getFieldValue('bookings')
    }
    console.log("Event: ", event);
    this.insert(event, sqlTypes);
    this.formCtrl.clearData();
    this.router.navigateByUrl("/main/myevents");
  }

  //Inserta el evento creado
  public insert(event:any, sqlTypes: any){
    this.service.insert(event, 'event', sqlTypes).subscribe(data => {
      console.log(data);
      this.showConfigured();
    });
  }

  //Muestra toast de evento creado
  public showConfigured() {
    const configuration: OSnackBarConfig = {
        action: 'Evento creado!',
        milliseconds: 5000,
        icon: 'check_circle',
        iconPosition: 'left'
    };
    this.snackBarService.open('Evento creado!', configuration);
  }

}

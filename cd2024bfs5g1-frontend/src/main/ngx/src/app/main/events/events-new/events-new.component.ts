import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OFormComponent, OntimizeService, OTextInputComponent, OTimeInputComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'app-events-new',
  templateUrl: './events-new.component.html',
  styleUrls: ['./events-new.component.css']
})

export class EventsNewComponent {
  @ViewChild('nameInput') public nameCtrl: OTextInputComponent;
  @ViewChild('timeInput') public timeCtrl: OTimeInputComponent;
  @ViewChild('form') public formCtrl: OFormComponent;

  constructor(private router: Router, private service: OntimizeService ) {
    const conf = this.service.getDefaultServiceConfiguration('events');
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

  createEvent() {
    this.router.navigate(['/main/myevents']);
  }
}

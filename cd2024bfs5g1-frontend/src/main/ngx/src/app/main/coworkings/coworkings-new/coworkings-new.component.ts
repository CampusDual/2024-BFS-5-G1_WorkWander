import { Component, ViewChild } from '@angular/core';
import { OFormComponent, DialogService } from 'ontimize-web-ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coworking-new',
  templateUrl: './coworkings-new.component.html',
  styleUrls: ['./coworkings-new.component.css']
})
export class CoworkingsNewComponent {

  @ViewChild('coworkingForm') coworkingForm: OFormComponent;

  constructor(
    private router: Router,
    private dialogService: DialogService
  ) {}

  public onInsertSuccess(): void {

    this.coworkingForm.setInitialMode();

    //const coworkingId = data.id;


    this.dialogService.info('Operación exitosa', 'El coworking se ha guardado correctamente');
  }

}

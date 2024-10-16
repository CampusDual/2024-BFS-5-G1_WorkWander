import { Component, ViewChild } from '@angular/core';
import { OFormComponent, DialogService, OTranslateService } from 'ontimize-web-ngx';
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
    private dialogService: DialogService,
    private translate: OTranslateService
  ) {}

  /**
   * Método que se ejecuta cuando la inserción de un nuevo coworking es exitosa.
   * 
   * - Restablece el formulario a su estado inicial.
   * - Muestra un mensaje de información indicando que la operación fue exitosa.
   */
  public onInsertSuccess(): void {
    // Restablece el formulario a su modo inicial
    this.coworkingForm.setInitialMode();

    
    const successMessageTitle = this.translate.get('COWORKING_ADDED')
    const successMessageBody = this.translate.get('COWORKING_ADDED2');

    // Muestra un mensaje de éxito al usuario
    this.dialogService.info(successMessageTitle, successMessageBody);
  }

}

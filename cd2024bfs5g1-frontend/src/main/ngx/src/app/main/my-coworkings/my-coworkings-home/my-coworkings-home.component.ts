import { Component } from '@angular/core';
import { DialogService, OntimizeService, OSnackBarConfig, OTranslateService, SnackBarService } from 'ontimize-web-ngx';
import { UtilsService } from 'src/app/shared/services/utils.service';


@Component({
  selector: 'app-my-coworkings-home',
  templateUrl: './my-coworkings-home.component.html',
  styleUrls: ['./my-coworkings-home.component.css']
})
export class MyCoworkingsHomeComponent {

  constructor(
    private service: OntimizeService,
    private snackBarService: SnackBarService,
    private translate: OTranslateService,
    protected dialogService: DialogService,
    private utils: UtilsService,) { }


  delete(evt) {
    // TODO: traducciones
    const confirmMessageTitle = this.translate.get("DELETE_COWORKING");
    const confirmMessageBody = this.translate.get("SURE_DELETE");

    if (this.dialogService) {
      this.dialogService.confirm(confirmMessageTitle, confirmMessageBody);
      this.dialogService.dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.deleteCoworking(evt["cw_id"]);
        }
      });
    }
  }

  deleteCoworking(id) {
    const filter = {
      cw_id: id,
    };

    const conf = this.service.getDefaultServiceConfiguration("coworkings");
    this.service.configureService(conf);
    this.service.delete(filter, "coworking").subscribe((data) => {

      console.log(data);
      if (data != null) {
        this.showInfoToast("COWORKING_DELETED");
        // window.location.reload();
      }

      // TODO: toast si no se puede eliminar
      this.showWarningToast("HAY RESERVAS PENDIENTES");

    });

  }

  showInfoToast(mensaje?: string) {
    const availableMessage = mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 5000,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  showWarningToast(mensaje?: string) {
    const availableMessage = mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 5000,
      icon: "warning",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

}

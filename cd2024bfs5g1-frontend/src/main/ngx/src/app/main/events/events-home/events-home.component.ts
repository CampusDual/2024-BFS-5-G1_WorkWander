import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import {
  OFilterBuilderComponent,
  OGridComponent,
  OntimizeService,
  OTranslateService,
} from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-events-home",
  templateUrl: "./events-home.component.html",
  styleUrls: ["./events-home.component.css"],
})
export class EventsHomeComponent implements OnInit {
  @ViewChild("eventsGrid") protected eventsGrid: OGridComponent;

  protected service: OntimizeService;

  //Creamos constructor
  constructor(
    protected injector: Injector,
    protected sanitizer: DomSanitizer,
    protected router: Router,
    protected utils: UtilsService,
    private translate: OTranslateService
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  // Creamos una variable para pasarle al html el número de columnas, por defecto 2
  public gridCols: number = 2;

  ngOnInit() {
    // Al cargar, obtendremos al ancho de pantalla, para posteriormente pasarselo como parámetro a la funcion setGridCols
    this.setGridCols(window.innerWidth);
    setTimeout(() => { this.deleteLoader() }, 250);
    this.configureService();
    //this.setFormatPrice();
  }

  // Función que cambiará el número de columnas a 1 si el ancho de ventana es menor de 1000
  setGridCols(width: number) {
    this.gridCols = width < 1000 ? 1 : 2;
  }

  // Función para convertir la imagen desde la base de datos
  public getImageSrc(base64: any): any {
    return base64
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:image/*;base64," + base64
      )
      : "./assets/images/event-default.jpg";
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration("events");
    this.service.configureService(conf);
  }

  // Formatea los decimales del precio y añade simbolo de euro en las card de event
  public formatPrice(price?: number): string {
    if (price != undefined) {
      let [integerPart, decimalPart] = price.toFixed(2).split(".");
      if (decimalPart == "") {
        decimalPart = "00";
      }
      return `${integerPart},<span class="decimal">${decimalPart}</span> €`;
    } else {
      return this.translate.get("FREE");
    }
  }

  formatDate(date: any): string {
    return this.utils.formatDate(date);
  }

  formatTime(time: any): string {
    return this.utils.formatTime(time);
  }

  getAvailability(reserved: any, capacity: any): number {
    return reserved / capacity;
  }
  deleteLoader() {
    const borrar = document.querySelector('#borrar') as HTMLDivElement;
    if (borrar) {
      borrar.textContent = "";
    }
  }
}

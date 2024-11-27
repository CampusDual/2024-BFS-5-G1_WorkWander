import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OFilterBuilderComponent, OGridComponent, OntimizeService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-events-home',
  templateUrl: './events-home.component.html',
  styleUrls: ['./events-home.component.css']
})
export class EventsHomeComponent implements OnInit{
  @ViewChild('filterBuilder', { static: true }) filterBuilder: OFilterBuilderComponent;
  @ViewChild("eventsGrid") protected eventsGrid: OGridComponent;

  public arrayServices: any = [];
  protected service: OntimizeService;

//Creamos constructor
constructor(
  protected injector: Injector,
  protected sanitizer: DomSanitizer,
  protected router: Router
) {
  this.service = this.injector.get(OntimizeService);
}

// Creamos una variable para pasarle al html el número de columnas, por defecto 2
public gridCols: number = 2;

ngOnInit() {
  // Al cargar, obtendremos al ancho de pantalla, para posteriormente pasarselo como parámetro a la funcion setGridCols
  this.setGridCols(window.innerWidth);
  this.configureService();
  //this.setFormatPrice();
}

// Función que cambiará el número de columnas a 1 si el ancho de ventana es menor de 1000
setGridCols(width: number) {
  this.gridCols = width < 1000 ? 1 : 2;
}

// Función para convertir la imagen desde la base de datos
public getImageSrc(base64: any): any {
  return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/event-default.jpg';
}

protected configureService() {
  const conf = this.service.getDefaultServiceConfiguration('events');
  this.service.configureService(conf);
}

public serviceList(services: string) {
  if (services != undefined) {
    return services.split(',')
  } else {
    return null;
  }
}

// Formatea los decimales del precio y añade simbolo de euro en las card de event
public formatPrice(price: number): string {
  let [integerPart, decimalPart] = price.toFixed(2).split('.');
  if (decimalPart== ''){
    decimalPart= "00";
   }
  return `${integerPart},<span class="decimal">${decimalPart}</span> €`;
}


}




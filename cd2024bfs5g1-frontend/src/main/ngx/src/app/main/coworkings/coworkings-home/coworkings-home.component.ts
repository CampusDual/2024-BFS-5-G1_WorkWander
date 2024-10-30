import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { OntimizeService } from 'ontimize-web-ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit{
  public arrayServices:any=[];
  protected service: OntimizeService;
  // Creamos constructor
  constructor(
    protected injector:Injector,
    protected sanitizer: DomSanitizer
  ) {this.service = this.injector.get(OntimizeService);}

  // Creamos una variable para pasarle al html el número de columnas, por defecto 2
  public gridCols: number = 2;

  ngOnInit() {
    // Al cargar, obtendremos al ancho de pantalla, para posteriormente pasarselo como parámetro a la funcion setGridCols
    this.setGridCols(window.innerWidth);
    this.configureService();
  }

  // Función que cambiará el número de columnas a 1 si el ancho de ventana es menor de 1000
  setGridCols(width: number) {
    this.gridCols = width < 1000 ? 1 : 2;
  }

  // Listener para que cuando se cambie el tamaño de la ventana, llamar al evento y la funcion setGridCols
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setGridCols((event.target as Window).innerWidth);
  }

  // Función para convertir la imagen desde la base de datos
  public getImageSrc(base64: any): any {
    console.log(base64);
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/coworking-default.jfif';
  }

  protected configureService(){
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public serviceList(cwId:any):void{
    const filter = {
      "cw_id":cwId
    }
    const columns = ["cw_id"];
    console.log(cwId);
    /*this.service.query(filter, columns, 'serviceCoworking').subscribe(data => {
      console.log(data);
    });*/

  }
}

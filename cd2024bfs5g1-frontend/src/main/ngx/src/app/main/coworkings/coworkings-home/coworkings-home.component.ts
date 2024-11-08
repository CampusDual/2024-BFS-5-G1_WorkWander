import { Component, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import { Expression, FilterExpressionUtils, OFilterBuilderComponent, OGridComponent, OntimizeService } from 'ontimize-web-ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit {
  @ViewChild('filterBuilder', { static: true }) filterBuilder!: OFilterBuilderComponent;
  @ViewChild("coworkingsGrid") protected coworkingsGrid: OGridComponent;

  public arrayServices: any = [];
  protected service: OntimizeService;
  // Creamos constructor
  constructor(
    protected injector: Injector,
    protected sanitizer: DomSanitizer
  ) {
    this.service = this.injector.get(OntimizeService);
  }

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
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/image-default.jpg';
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public serviceList(services: string) {
    if (services != undefined) {
      return services.split(',')
    } else {
      return null;
    }

  }
  createFilter(values: Array<{ attr: string, value: any }>): Expression {
    let serviceExpressions: Array<Expression> = [];

    console.log("values", values)
    console.log("values.length", values.length);

    values.forEach(fil => {
      if (!fil.value) return;

      console.log("fil.value", fil.value);
      console.log("fil.attr", fil.attr);
      if (fil.attr == 'services') {
      // if (fil.attr === 'srv_name') {
      // if (fil.attr === 'service') {
        console.log("fil.attr", fil.attr);
       if (Array.isArray(fil.value)) {
          fil.value.forEach((val) => {
            console.log("fil.value, fil.attr, val", fil.value, fil.attr, val);
            serviceExpressions.push(
              FilterExpressionUtils.buildExpressionLike(fil.attr, val)
            );
          });
        } else {
          serviceExpressions.push(
            FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value)
          );
          // }
        }
      }
    });
    // Construir expresión AND para SERVICES
    let serviceExpression: Expression = null;
    if (serviceExpressions.length > 0) {
      serviceExpression = serviceExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_AND
          // FilterExpressionUtils.OP_OR
        )
      );
    }
    return serviceExpression;
  }

  clearFilters(): void {
    this.coworkingsGrid.reloadData();
  }
  public formatPrice(price: number): string {
      const [integerPart, decimalPart] = price.toFixed(2).split('.');
      return `${integerPart},<span class="decimal">${decimalPart}</span> €`;
    }
}

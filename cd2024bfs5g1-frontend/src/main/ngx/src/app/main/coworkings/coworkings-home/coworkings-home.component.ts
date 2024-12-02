import { Component, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Expression, FilterExpressionUtils, OFilterBuilderComponent, OGridComponent, OntimizeService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit {
  @ViewChild('filterBuilder', { static: true }) filterBuilder: OFilterBuilderComponent;
  @ViewChild("coworkingsGrid") protected coworkingsGrid: OGridComponent;

  public arrayServices: any = [];
  protected service: OntimizeService;

  // Creamos constructor
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

  // Listener para que cuando se cambie el tamaño de la ventana, llamar al evento y la funcion setGridCols
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setGridCols((event.target as Window).innerWidth);
  }

  // Función para convertir la imagen desde la base de datos
  public getImageSrc(base64: any): any {
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/coworking-default.jpg';
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
  // Función para crear los filtros de busqueda avanzada
  createFilter(values: Array<{ attr: string; value: any }>): Expression {
    let filtersOR: Array<Expression> = [];
    let locationExpressions: Array<Expression> = [];
    let serviceExpressions: Array<Expression> = [];
    values.forEach((fil) => {
      if (fil.value) {
        if (fil.attr === "cw_location") {
          if (Array.isArray(fil.value)) {
            fil.value.forEach((val) => {
              locationExpressions.push(
                FilterExpressionUtils.buildExpressionLike(fil.attr, val)
              );
            });
          } else {
            locationExpressions.push(
              FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value)
            );
          }
        } else if (fil.attr === "services") {
          if (Array.isArray(fil.value)) {
            fil.value.forEach((val) => {
              serviceExpressions.push(
                FilterExpressionUtils.buildExpressionLike(fil.attr, val)
              );
            });
          } else {
            serviceExpressions.push(
              FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value)
            );
          }
        }
      }
    });
    // Construir expresión OR para locations
    let locationExpression: Expression = null;
    if (locationExpressions.length > 0) {
      locationExpression = locationExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_OR
        )
      );
    }
    // Construir expresión AND para services
    let serviceExpression: Expression = null;
    if (serviceExpressions.length > 0) {
      serviceExpression = serviceExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_AND
        )
      );
    }
    // Construir expresión para combinar filtros avanzados
    const expressionsToCombine = [
      locationExpression,
      serviceExpression
    ].filter((exp) => exp !== null);
    let combinedExpression: Expression = null;
    if (expressionsToCombine.length > 0) {
      combinedExpression = expressionsToCombine.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_AND
        )
      );
    }
    return combinedExpression;
  }
  //Reinicia los valores de los filtros
  clearFilters(): void {
    this.coworkingsGrid.reloadData();
  }
  // Formatea los decimales del precio y añade simbolo de euro en las card de coworking
  public formatPrice(price: number): string {
    let [integerPart, decimalPart] = price.toFixed(2).split('.');
    if (decimalPart == '') {
      decimalPart = "00";
    }
    return `${integerPart},<span class="decimal">${decimalPart}</span> €`;
  }
}

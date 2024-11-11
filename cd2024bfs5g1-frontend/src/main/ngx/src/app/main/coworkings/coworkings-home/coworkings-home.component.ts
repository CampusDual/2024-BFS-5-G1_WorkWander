import { Component, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import { Expression, FilterExpressionUtils, OComboComponent, OGridComponent, OntimizeService, OTextInputComponent } from 'ontimize-web-ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit {
  public arrayServices: any = [];
  protected service: OntimizeService;
  //Variable para formatear el precio
  //public formatPrice: SafeHtml;


  @ViewChild("coworkingsGrid") protected coworkingsGrid: OGridComponent
  @ViewChild("coworkingsSearch") protected coworkingsSearch: OTextInputComponent

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

  createFilter(values: Array<{ attr: string; value: any }>): Expression {
    let filters: Array<Expression> = [];
    values.forEach((fil) => {
      if (fil.value) {
        if (fil.attr === "cw_name") {
          filters.push(
            FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value)
          );
        } else if (fil.attr === 'cw_description') {
          filters.push(
            FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value)
          )
        } else if(fil.attr === "cw_location"){
          if (Array.isArray(fil.value)) {
            fil.value.forEach((val) => {
              console.log("fil.value, fil.attr, val", fil.value, fil.attr, val);
              filters.push(
                FilterExpressionUtils.buildExpressionLike(fil.attr, val)
              );
            });
          } else {
            filters.push(
              FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value)
            );
          }
        }
      }
    });
    let locationsExpression: Expression = null;
    if (filters.length > 0) {
      locationsExpression = filters.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_AND
          // FilterExpressionUtils.OP_OR
        )
      );
    }
    return locationsExpression;

//   if (filters.length > 0) {
//     return filters.reduce((exp1, exp2) =>
//       FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_AND)
//     );
//   } else {
//     return null;
//   }
  }

  public formatPrice(price: number): string {
    const [integerPart, decimalPart] = price.toFixed(2).split('.');
    return `${integerPart},<span class="decimal">${decimalPart}</span> €`;
  }

  clearFilters(): void {
    this.coworkingsGrid.reloadData()
  }
}

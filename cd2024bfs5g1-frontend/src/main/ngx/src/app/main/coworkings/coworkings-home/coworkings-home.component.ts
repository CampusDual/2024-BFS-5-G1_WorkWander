import { Component, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import { Expression, FilterExpressionUtils, OFilterBuilderComponent, OFilterBuilderValues, OntimizeService } from 'ontimize-web-ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit{
  @ViewChild('filterBuilder', { static: true }) filterBuilder!: OFilterBuilderComponent;

  public arrayServices:any=[];
  protected service: OntimizeService;
  // Creamos constructor
  constructor(
    protected injector:Injector,
    protected sanitizer: DomSanitizer
  ) {this.service = this.injector.get(OntimizeService);
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

  protected configureService(){
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public serviceList(services:string){
    if(services!=undefined){
      return services.split(',')
    }else{
      return null;
    }

  }
  createFilter(values: Array<{ attr, value }>): Expression {
    // Prepare simple expressions from the filter components values
    let filters: Array<Expression> = [];
    values.forEach(fil => {
      if (fil.value) {
        if (fil.attr === 'SERVICES') {
          filters.push(FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value));
        }
        // if (fil.attr === 'EMPLOYEETYPEID') {
        //   filters.push(FilterExpressionUtils.buildExpressionEquals(fil.attr, fil.value));
        // }
      }
    });

    // Build complex expression
    if (filters.length > 0) {
      return filters.reduce((exp1, exp2) => FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_AND));
    } else {
      return null;
    }
  }  onServiceFilterChange(selectedService: string) {
    if (this.filterBuilder) {
      const filters: OFilterBuilderValues[] = [
        {
          attr: 'services',       // Nombre de la columna en la base de datos o servicio
          value: selectedService  // Valor del filtro basado en el servicio seleccionado
        }
      ];
      this.filterBuilder.setFilterValues(filters);
    }
  }
  searchReceivedParams() {
    this.actRoute.queryParams.subscribe((params) => {
      const category: any = params["category"] || null;
      const keyword: any = params["keyword"] || null;
      if (category != undefined) {
        let arrayNuevo = [];
        arrayNuevo.push(category);
        this.categoryField.setValue(arrayNuevo);
      }
      if (keyword != undefined) {
        this.searcher.setValue(keyword);
      }else{
        this.searcher.setValue('');
      }
      this.toyGrid.reloadData();
    });
  }

}

import {
  Component,
  HostListener,
  Injector,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import * as L from 'leaflet';
import {
  Expression,
  FilterExpressionUtils,
  ODateRangeInputComponent,
  OFilterBuilderComponent,
  OGridComponent,
  OIntegerInputComponent,
  OntimizeService,
  OSliderComponent,
  OTranslateService,
  SnackBarService
} from "ontimize-web-ngx";
import { OMapComponent } from "ontimize-web-ngx-map";
import { Coworking, CustomMapService } from "src/app/shared/services/custom-map.service";

@Component({
  selector: "app-coworkings-home",
  templateUrl: "./coworkings-home.component.html",
  styleUrls: ["./coworkings-home.component.css"],
})
export class CoworkingsHomeComponent implements OnInit {
  @ViewChild("filterBuilder", { static: true })
  filterBuilder: OFilterBuilderComponent;
  @ViewChild("coworkingsGrid") protected coworkingsGrid: OGridComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;
  @ViewChild("id") idCoworking: OIntegerInputComponent;
  @ViewChild("cw_daily_price") cw_daily_price: OSliderComponent;
  @ViewChild("coworking_map") coworking_map: OMapComponent;

  public arrayServices: any = [];
  protected service: OntimizeService;
  public dateArray = [];
  public idioma: string;
  public toPrice: number = 0;
  public starSearchValue: number = 0;

  public mapVisible: boolean = false;
  leafletMap: any;
  selectedCoworking: any = null;
  data: any[];
  coworkings: Coworking[];
  markerGroup: any;
  nearMeMarkerGroup: any;
  // Creamos constructor
  constructor(
    protected injector: Injector,
    protected sanitizer: DomSanitizer,
    protected router: Router,
    private translate: OTranslateService,
    protected snackBarService: SnackBarService,
    private mapService: CustomMapService,

  ) {
    this.service = this.injector.get(OntimizeService);
  }

  // Creamos una variable para pasarle al html el número de columnas, por defecto 2
  public gridCols: number = 2;

  ngOnInit() {
    // Al cargar, obtendremos al ancho de pantalla, para posteriormente pasarselo como parámetro a la funcion setGridCols
    this.setGridCols(window.innerWidth);
    this.configureService();
    setTimeout(() => { this.deleteLoader() }, 500);
    this.leafletMap = this.coworking_map.getMapService().getMap();


  }

  // Función que cambiará el número de columnas a 1 si el ancho de ventana es menor de 1000
  setGridCols(width: number) {
    this.gridCols = width < 1000 ? 1 : 2;
  }

  // Listener para que cuando se cambie el tamaño de la ventana, llamar al evento y la funcion setGridCols
  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.setGridCols((event.target as Window).innerWidth);
  }

  // Función para convertir la imagen desde la base de datos
  public getImageSrc(base64: any): any {
    return base64
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:image/*;base64," + base64
      )
      : "./assets/images/coworking-default.jpg";
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration("coworkings");
    this.service.configureService(conf);
  }

  public serviceList(services: string) {
    if (services != undefined) {
      return services.split(",");
    } else {
      return null;
    }
  }

  click($event: any) {
    this.toPrice = $event;
  }

  getRatio() {
    return this.starSearchValue;
  }

  formatLabelUntil(): any {
    return this.toPrice + " €";
  }

  // Función para crear los filtros de busqueda avanzada
  createFilter(values: Array<{ attr: string; value: any }>): Expression {
    let locationExpressions: Array<Expression> = [];
    let serviceExpressions: Array<Expression> = [];
    let daterangeExpressions: Array<Expression> = [];
    let priceExpressions: Array<Expression> = [];
    let starsExpressions: Array<Expression> = [];
    let dateNullExpression: Expression;
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
        } else if (fil.attr == "date") {
          daterangeExpressions.push(
            FilterExpressionUtils.buildExpressionMoreEqual(
              fil.attr,
              fil.value.startDate.toDate()
            )
          );
          daterangeExpressions.push(
            FilterExpressionUtils.buildExpressionLessEqual(
              fil.attr,
              fil.value.endDate.toDate()
            )
          );
          dateNullExpression = FilterExpressionUtils.buildExpressionIsNull(
            fil.attr
          );
        } else if (fil.attr == "cw_daily_price") {
          priceExpressions.push(
            FilterExpressionUtils.buildExpressionLessEqual(fil.attr, fil.value)
          );
        } else if (fil.attr == "ratio") {
          starsExpressions.push(
            FilterExpressionUtils.buildExpressionMoreEqual(fil.attr, fil.value)
          );
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

    // Construir expresión AND para daterange
    let daterangeExpression: Expression = null;
    if (daterangeExpressions.length > 0) {
      daterangeExpression = daterangeExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_AND
        )
      );
      daterangeExpression = FilterExpressionUtils.buildComplexExpression(
        daterangeExpression,
        dateNullExpression,
        FilterExpressionUtils.OP_OR
      );
    }

    //Expresión AND para price
    let priceExpression: Expression = null;
    if (priceExpressions.length > 0) {
      priceExpression = priceExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_AND
        )
      );
    }


    // Construir expresión AND para stars
    let starsExpression: Expression = null;
    if (starsExpressions.length > 0) {
      starsExpression = starsExpressions.reduce((exp1, exp2) =>
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
      serviceExpression,
      priceExpression,
      daterangeExpression,
      starsExpression,
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
    this.starSearchValue = 0;
  }

  // Formatea los decimales del precio y añade simbolo de euro en las card de coworking
  public formatPrice(price: number): string {
    let [integerPart, decimalPart] = price.toFixed(2).split(".");
    if (decimalPart == "") {
      decimalPart = "00";
    }
    return `${integerPart},<span class="decimal">${decimalPart}</span> €`;
  }

  currentDate() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  changeFormatDate(milis: number, idioma: string) {
    const fecha = new Date(milis);
    let fechaFormateada = new Intl.DateTimeFormat(idioma).format(fecha);
    return fechaFormateada;
  }

  noResults: boolean = false;

  ngAfterViewInit() {
    // Escucha los cambios en data del grid
    this.coworkingsGrid.onDataLoaded.subscribe(() => {
      this.noResults = this.coworkingsGrid.dataArray.length === 0;
      this.updateMapMarkers();
    });
  }

  //------------------------------- MAPA -------------------------------
  showHideMap() {
    this.mapVisible = !this.mapVisible;
    if (this.mapVisible) {
      // mandar el mapa al que se dene incluir la marca
      setTimeout(() => {
        this.leafletMap = this.coworking_map.getMapService().getMap();
        this.mapService.setUserMap(this.coworking_map);
      }, 500);
    }
  }

  updateMapMarkers() {
    if (this.mapVisible) {

      //Inicializar markerGroup si no está inicializado
      if (!this.markerGroup) {
        this.markerGroup = L.layerGroup().addTo(this.leafletMap);
      }
      // Eliminar todas las marcas previas
      this.markerGroup.clearLayers();
      if (this.nearMeMarkerGroup) { this.nearMeMarkerGroup.clearLayers(); }
      // Añadir una marca por cada coworking
      const coworkings = this.coworkingsGrid.dataArray;

      coworkings.forEach((coworking) => {

        const marker = L.marker([coworking.cw_lat, coworking.cw_lon], {
          draggable: false,
          clickable: true,
        }).bindTooltip(coworking.cw_name, { permanent: false, direction: 'top' });

        marker.on('click', () => {
          this.router.navigate(['/coworkings', coworking.cw_id], {
            queryParams: { isdetail: true }
          });
        });

        this.markerGroup.addLayer(marker);
      });

      // Añadir el grupo de capas al mapa (si no está ya añadido)
      if (!this.leafletMap.hasLayer(this.markerGroup)) {
        this.markerGroup.addTo(this.leafletMap);
      }
      // Ajustar el nivel de zoom y centrar el mapa
      if (coworkings.length > 0) {
        const latitudes = coworkings.map(c => c.cw_lat);
        const longitudes = coworkings.map(c => c.cw_lon);
        const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const avgLon = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
        this.leafletMap.setView([avgLat, avgLon], 6);
      }
    }
  }

  async nearOfMe() {
    await this.mapService.getUserGeolocation();
    this.coworkings = await this.mapService.obtenerCoworkings()

    // Inicializar nearMeMarkerGroup si no está inicializado
    if (!this.nearMeMarkerGroup) {
      this.nearMeMarkerGroup = L.layerGroup().addTo(this.leafletMap);
    }
    this.nearMeMarkerGroup.clearLayers();
    this.mapService.addMarkers(this.nearMeMarkerGroup, this.coworkings);
  }

  // Compara la fecha del coworking con la fecha actual y devuelve true si la diferencia es menor a 7 días
  compareDate(startDate: any): boolean {
    // El primer valor representa los dias, en caso de querer
    // modificar la cantidad de días a comparar basta con
    // modificar ese número.
    let sieteDiasEnMilisegundos = 7 * 24 * 60 * 60 * 1000;
    let diferencia = this.currentDate().getTime() - startDate;
    return sieteDiasEnMilisegundos > diferencia;
  }

  deleteLoader() {
    const borrar = document.querySelector('#borrar') as HTMLDivElement;
    if (borrar) {
      borrar.textContent = "";
    }
  }
}

import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef
} from "@angular/core";
import {
  OComboComponent,
  OntimizeService,
  OSnackBarConfig,
  OValueChangeEvent,
  SnackBarService,
  OTranslateService,
  ODateRangeInputComponent,
  OIntegerInputComponent,
} from "ontimize-web-ngx";
import { Subscription, map } from 'rxjs';
import {
  ChartService,
  OChartComponent,
  PieChartConfiguration
} from "ontimize-web-ngx-charts";
import moment, { locale } from "moment";

@Component({
  selector: "app-analytics-facturation",
  templateUrl: "./analytics-facturation.component.html",
  styleUrls: ["./analytics-facturation.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: {
    "[class.custom-chart]": "true",
  },
})
export class AnalyticsFacturationComponent implements OnInit, OnDestroy {
  selectedCoworkings: string[] = [];
  allCowork: number[] = [];
  allCoworkNames:string[] = [];
  selectedMonths: number[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  translateServiceSubscription: Subscription;
  listOfMonths: any[] = [];
  dateArray = [];
  year:number;
  typeData:string;
  languageChoose = false;
  resolveData = true;
  locale:string;
  points:string;
  colorScheme = {
    domain: [
    "#A49377",
    "#66477B",
    "#92CCD1",
    "#80000B",
    "#6A9A32",
    "#B1925D",
    "#FABCB1",
    "#FF6700",
    "#D3DBF2",
    " #1C2A34",
    "#7E1617",
    "#BABEC9"],
  };

  chartParameters: PieChartConfiguration;

  @ViewChild("comboCoworkingInput", {static: true}) comboCoworkingInput: OComboComponent;
  @ViewChild("comboMonthInput") comboMonthInput: OComboComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;
  @ViewChild("inputYear") inputYear: OIntegerInputComponent;
  @ViewChild("multiBarChart") multiBarChart:OChartComponent;

  constructor(
    private service: OntimizeService,
    private snackBarService: SnackBarService,
    protected translate: OTranslateService,
    protected injector: Injector,
    protected chartservice: ChartService,
    protected elementRef: ElementRef
  ) {
    this.translateServiceSubscription =
      this.translate.onLanguageChanged.subscribe(() => {
        this.languageChange();
      });
  }

  /**
   * Configuración del gráfico
   */
  configureChart(){
    this.chartParameters = null;
    this.chartParameters = new PieChartConfiguration();
    this.chartParameters.margin.top = 0;
    this.chartParameters.margin.right = 0;
    this.chartParameters.margin.bottom = 0;
    this.chartParameters.margin.left = 0;
    this.chartParameters.duration = 0;
    this.chartParameters.labelType = "value";
    this.chartParameters.labelSunbeamLayout = false;
    this.chartParameters.valueType = "double";
    this.chartParameters.showLabels = true;
    this.chartParameters.showTooltip = true;
    return this.chartParameters;
  }

  ngOnDestroy(): void {
    this.translateServiceSubscription.unsubscribe();
  }
  ngOnInit(): void {
    let date = new Date();
    this.year = date.getFullYear();
    this.selectedMonths = [];
    this.typeData ="MONTHS"
    this.allMonths();
    this.points = "...";
    this.allCoworkings();
    this.locale=this.translate.getCurrentLang();
    this.comboCoworkingInput.onDataLoaded.subscribe((rest: any) => {
      const data = this.comboCoworkingInput.getDataArray()
      this.comboCoworkingInput.setSelectedItems([data[0]['cw_id']])
      this.selectedCoworkings.push(data[0]['cw_id']);
      this.comboMonthInput.setSelectedItems([this.listOfMonths[0]['id']])
    })

  }

  /**
   * Recupera todos los coworkings para hacer la solicitud de datos por defecto
  */
  allCoworkings() {
    let configurationService =
      this.service.getDefaultServiceConfiguration("coworkings");
    this.service.configureService(configurationService);
    let filter = {};
    let columns = ["cw_id", "cw_name"];
    this.service.query(filter, columns, "coworkingByUser").subscribe((data) => {
      this.comboCoworkingInput.data=data.data
      for (let d = 0; d < data.data.length; d++) {
        this.allCowork.push(data.data[d]["cw_id"]);
      }
      this.setMonth();
    });
  }

  /**
   * Lista de meses por defecto
   */
  allMonths(){
    this.listOfMonths[0] = {id: 0, name: this.translate.get("ALL")}
    this.listOfMonths[1] = {id: 1, name: this.translate.get("JANUARY")};
    this.listOfMonths[2] = {id: 2, name: this.translate.get("FEBRUARY")};
    this.listOfMonths[3] = {id: 3, name: this.translate.get("MARCH")}
    this.listOfMonths[4] = {id: 4, name: this.translate.get("APRIL")};
    this.listOfMonths[5] = {id: 5, name: this.translate.get("MAY")};
    this.listOfMonths[6] = {id: 6, name: this.translate.get("JUNE")};
    this.listOfMonths[7] = {id: 7, name: this.translate.get("JULY")};
    this.listOfMonths[8] = {id: 8, name: this.translate.get("AUGUST")};
    this.listOfMonths[9] = {id: 9, name: this.translate.get("SEPTEMBER")}
    this.listOfMonths[10] = {id: 10, name: this.translate.get("OCTOBER")};
    this.listOfMonths[11] = {id: 11, name: this.translate.get("NOVEMBER")};
    this.listOfMonths[12] = {id: 12, name: this.translate.get("DECEMBER")};
  }

  /**
   * Se ejecuta en caso de que cambie el idioma
   */
  languageChange() {
    this.languageChoose = true;
    this.locale=this.translate.getCurrentLang();
    this.allMonths();
    this.comboMonthInput.data = this.listOfMonths;
    this.adaptResult(this.chartData, true);
    this.configureChart();
  }

  /**
   * Se llama en caso de seleccionar uno o varios coworkings
   * @param selectedNames
   */
  onCoworkingChange(selectedNames: OValueChangeEvent) {
    if (selectedNames.type === 0) {
      this.selectedCoworkings = selectedNames.newValue;
    }
  }

  /**
   * Efecto de espera de recepción de datos
   */
  efects(){
    let elements = document.getElementsByClassName("txt-rotate");
    for (let ir = 0; ir < elements.length; ir++) {
        let toRotate = this.points;
        if (toRotate) {
            let period = 1000;
            let loopNumber = 0;
            let txt = "";
            let isDeleting = false;
            this.tick(loopNumber, txt, toRotate, isDeleting, elements[ir], period);
        }
    }
  }

  /**
   * Creae el efecto de espera
   * @param loopNumber
   * @param txt
   * @param toRotate
   * @param isDeleting
   * @param el
   * @param period
   */
  tick(loopNumber:number, txt:string, toRotate:string, isDeleting:boolean, el:any, period:number){
    let i = loopNumber%toRotate.length;
    let fullTxt = toRotate;
    if (isDeleting) {
      txt = fullTxt.substring(0, txt.length-1);
    }else{
      txt = fullTxt.substring(0, txt.length+1);
    }
    el.innerHTML = `<span class="wrap">${txt}</span>`
    let that = this;
    let delta = 150 - Math.random() * 100;
    if (isDeleting) {
      delta / 2;
    }
    if (!isDeleting && fullTxt === txt) {
      delta = period;
      isDeleting = true;
    }else if(isDeleting && txt === ""){
      isDeleting = false;
      loopNumber++;
      delta = 1000;
    }
    setTimeout(function(){
      that.tick(loopNumber, txt, toRotate, isDeleting, el, period);
    }, delta)
  }

  /**
   * Se llama desde el onInit y en el combo de meses
   * @param selectMonths
   */
  setMonth(selectMonths?: OValueChangeEvent) {
    if(!this.languageChoose){
      this.efects();
      if((selectMonths == undefined || selectMonths.newValue == 0 || this.selectedMonths.length == 0) && (this.selectedCoworkings.length > 0)){
        this.selectedMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.requestDataMonths(this.selectedMonths, this.selectedCoworkings);
      }else if((this.selectedMonths.length > 0 || selectMonths.newValue >= 0 )  && this.selectedCoworkings.length == 0 ){
        this.selectedMonths = selectMonths.newValue;
        this.requestDataMonths(this.selectedMonths, this.allCowork);
      }else if(selectMonths.type === 0 && this.selectedCoworkings.length > 0){
        this.selectedMonths = selectMonths.newValue;
        this.requestDataMonths(this.selectedMonths, this.selectedCoworkings);
      }
    }else{
      this.languageChoose = false;
    }
  }

  /**
   * Petición de los datos por meses
   * @param months
   * @param coworkings
   */
  requestDataMonths(months?: Array<number>, coworkings?: Array<any>) {
    this.resolveData = true;
    if((this.year != undefined || this.year > 0)){
      this.configureChart();
      this.year = this.inputYear.getValue();
      let filter = {
        "cw_id": coworkings,
        "month": months,
        "year": +this.year
      };
      let columns = ["coworking_name", "account", "m"];
      let configurationService =
      this.service.getDefaultServiceConfiguration("coworkings");
      this.service.configureService(configurationService);
      this.service
        .query(filter, columns, "coworkingFacturationChart")
        .subscribe((response) => {
          this.resolveData = false;
          if (response.code == 0 && response.data[0]["data"].length > 0) {
            this.typeData="MONTHS";
            this.languageChoose = false;
            this.isGraph = true;
            this.chartData = [];
            this.chartData = response.data[0]["data"];
            this.adaptResult(this.chartData, false);
            this.showData();
          } else {
              this.resolveData = false;
              this.isGraph = false;
          }
        });
    }
  }

  /**
   * Devuelve un array con la data para el gráfico
   * @returns this.chartData
   */
  showData(): Array<Object> {
    return this.chartData;
  }

/**
 * Muestra el nombre de los meses en la leyenda
 * @param data
 */
  adaptResult(data?: Array<any>, translation?:boolean){
    for (let i = 0; i < data.length; i++) {
      for (let x = 0; x < data[i].series.length; x++) {
        if (translation) {
          data[i].series[x].name = this.translate.get(this.listOfMonths[data[i].series[x].i].name);
          const element = this.elementRef.nativeElement;
          let item = element.querySelectorAll('.legend-label-text');
          for (let i = 0; i < item.length; i++) {
            item[i].innerText = data[i].series[x].name;
          }          
        }else{
          data[i].series[x].name = this.translate.get(this.listOfMonths[data[i].series[x].name].name);
        }
      }
    }
  }


  /**
   * Se muestra el mensaje en el toast
   * @param mensaje
   */
  showAvailableToast(mensaje?: string) {
    const availableMessage = mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 7500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }
}

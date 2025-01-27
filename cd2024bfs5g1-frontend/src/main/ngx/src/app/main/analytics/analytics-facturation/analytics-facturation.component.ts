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
import { Subscription, concatMap, map } from 'rxjs';
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
  numberOfMonths: number[] = [];
  selectedMonths: number[] = [];
  oldSelectedMonths: number[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  translateServiceSubscription: Subscription;
  listOfMonths: any[] = [];
  year:number;
  languageChoose = false;
  typeData:string;
  resolveData = true;
  maxSelection = 5;
  locale:string;
  points:string;
  yearsData: any[]=[];
  colors:string[]=[
    "#9ACD32",
    "#6B8E23",
    "#556B2F",
    "#8FBC8F",
    "#2E8B57"
  ]
  colorScheme = {
    domain: [],
  };

  chartParameters: PieChartConfiguration;

  @ViewChild("comboCoworkingInput", {static: true}) comboCoworkingInput: OComboComponent;
  @ViewChild("comboMonthInput") comboMonthInput: OComboComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;
  @ViewChild("inputYear") inputYear: OIntegerInputComponent;
  @ViewChild("multiBarChart") multiBarChart:OChartComponent;
  @ViewChild("comboYearsInput", {static: true}) comboYearsInput: OComboComponent;

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
    this.typeData="MONTHS"
    this.selectedMonths = [];
    this.getYears();
    this.allMonths();
    this.points = "...";
    this.locale=this.translate.getCurrentLang();
    this.comboCoworkingInput.onDataLoaded.subscribe((rest: any) => {
      const data = this.comboCoworkingInput.getDataArray();
      this.comboCoworkingInput.setSelectedItems([data[0]['cw_id']]);
      this.selectedCoworkings.push(data[0]['cw_id']);
      this.selectedMonths.push(this.listOfMonths[0]);
      this.comboMonthInput.setSelectedItems([this.listOfMonths[0]['id']]);
      this.oldSelectedMonths=this.comboMonthInput.getSelectedItems();
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

  getYears(){
    const filter = {};
    const columns = ["y"];
    let configurationService = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(configurationService);
    this.service.query(filter, columns, "yearsWithBookings").subscribe((response) => {
      if (response.code == 0 && response.data.length > 0) {
        for (let i = 0; i < response.data.length; i++) {
          let years = {y:response.data[i]['y'], year:response.data[i]['year']};
          this.yearsData[i]=years;
        }
        this.year = this.yearsData[0]['y'];
        this.comboYearsInput.setValue(this.yearsData[0]['y']);
      }
    });
  }

  /**
   * Se ejecuta en caso de que cambie el idioma
   */
  languageChange() {
    this.languageChoose = true;
    this.locale=this.translate.getCurrentLang();
    this.allMonths();
    let viejo = []
    this.oldSelectedMonths.forEach(e=>{
      viejo.push(e)
    });
    this.comboMonthInput.data = this.listOfMonths;
    this.comboMonthInput.setSelectedItems(viejo);
    this.adaptResult(this.chartData, true);
    this.configureChart();
  }

  /**
   * Se llama en caso de seleccionar uno o varios coworkings
   * @param selectedNames
   */
  onCoworkingChange(selectedNames: any) {
    if (selectedNames.type === 0) {
      if (selectedNames.newValue.length <= this.maxSelection) {
        this.selectedCoworkings = selectedNames.newValue;
        if (selectedNames.type === 0) {
          this.selectedCoworkings = selectedNames.newValue;
          this.setMonth(this.comboMonthInput.getSelectedItems(), this.comboCoworkingInput.getSelectedItems());
        }
      } else {
        this.comboCoworkingInput.setValue(selectedNames.oldValue);
        this.showAvailableToast(
          this.translate.get("COWORKING_CHART_SELECTION_LIMIT") +
            this.maxSelection +
            " coworkings."
        );
        return;
      }
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
  setMonth(selectMonths?: any, selectCoworkings?:any) {
    this.oldSelectedMonths=this.comboMonthInput.getSelectedItems();
    this.year = this.comboYearsInput.getValue()
    if(!this.languageChoose){
      this.efects();
      if (this.comboMonthInput.getSelectedItems()[0]==0 && this.comboCoworkingInput.getSelectedItems().length > 0
          && this.year!=undefined) {
        this.selectedMonths = [1,2,3,4,5,6,7,8,9,10,11,12]
        selectMonths = this.selectedMonths;
        this.requestDataMonths(selectMonths, this.comboCoworkingInput.getSelectedItems(), this.year);
      } else if(this.comboMonthInput.getSelectedItems().length > 0 && this.comboCoworkingInput.getSelectedItems().length>0
          && this.year!=undefined) {
          this.requestDataMonths(this.comboMonthInput.getSelectedItems(), this.comboCoworkingInput.getSelectedItems(), this.year);
      } else {
          this.resolveData=false
          this.isGraph=false
          return
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
  requestDataMonths(months?: Array<number>, coworkings?: Array<any>, years?: number) {
    this.resolveData = true;
    this.year=years;
    if((this.year != undefined || this.year > 0)){
      this.configureChart();
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
            this.languageChoose = false;
            this.isGraph = true;
            this.chartData = [];
            this.chartData = response.data[0]["data"];
            this.numberOfMonths=[];
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
  adaptResult(data?:Array<any>, translation?:boolean){
    const element = this.elementRef.nativeElement;
    let legend = element.querySelectorAll('.legend-label-text');
    if (translation) {
      legend.forEach((item, index) => {
        legend[index].innerText = this.translate.get(this.listOfMonths[this.numberOfMonths[index]].name);
      });
    }else{
      for(let i=0;i<data.length;i++){
        for(let x=0;x<data[i].series.length;x++){
          this.colorScheme.domain[x]=this.colors[x];
        }
      }
      this.numberOfMonths = []
      for (let i = 0; i < data.length; i++) {
        if (!this.numberOfMonths.includes(data[i].i)) {
          this.numberOfMonths.push(data[i].i);
        }
        data[i].name = this.translate.get(this.listOfMonths[data[i].i].name);
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

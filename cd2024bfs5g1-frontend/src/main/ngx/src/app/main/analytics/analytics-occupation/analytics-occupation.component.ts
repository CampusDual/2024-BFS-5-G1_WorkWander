import { locale } from 'moment';
import { Moment } from 'moment';
import { Component, ViewEncapsulation, ViewChild, OnInit } from "@angular/core";
import {
  OComboComponent,
  OntimizeService,
  OSnackBarConfig,
  OValueChangeEvent,
  SnackBarService,
  OTranslateService,
  ODateRangeInputComponent,
} from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-analytics-occupation",
  templateUrl: "./analytics-occupation.component.html",
  styleUrls: ["./analytics-occupation.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { "[class.custom-chart]": "true" },
})
export class AnalyticsOccupationComponent implements OnInit {
  selectedCoworkings: string[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  maxSelection = 3;
  chartParameters: any;
  initDates = {}
  moment:Moment;
  translateServiceSubscription: Subscription;
  locale: string;
  formatDate="YYYY-MM-DD";
  colorScheme = {
    domain: [
    "#5D8736",
    "#008DDA",
    "#FF6700",
    ],
  };

  @ViewChild("comboCoworkingInput", {static:true}) comboCoworkingInput: OComboComponent;
  @ViewChild("daterange", {static:true}) bookingDate: ODateRangeInputComponent;

  public dateArray = [];

  constructor(
    private service: OntimizeService,
    private snackBarService: SnackBarService,
    private translate: OTranslateService,
    protected utils: UtilsService,
  ) {
    this.translateServiceSubscription = this.translate.onLanguageChanged.subscribe(() => {
      this.languageChange();
    });
  }

  ngOnInit(): void {
    this.comboCoworkingInput.onDataLoaded.subscribe(() => {
      const data = this.comboCoworkingInput.getDataArray();
      this.comboCoworkingInput.setSelectedItems([data[0]['cw_id']]);
      this.selectedCoworkings.push(data[0]['cw_id']);
      this.setDatesAndQueryBackend();
    });
    let date = new Date();
    let d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let c = new Date();
    c.setDate(d.getDate() - 7);
    let init = d.getFullYear()+"-"+d.getMonth()+1+"-"+c.getDate();
    let end = d.getFullYear()+"-"+d.getMonth()+1+"-"+d.getDate();
    this.initDates = {
      startDate: moment(init).format(this.formatDate),
      endDate: moment(end).format(this.formatDate)
    }
    this.dateArray[0] = this.initDates["startDate"];
    this.dateArray[1] = this.initDates["endDate"];
  }

  firstRequest() {
    this.comboCoworkingInput.getSelectedItems().forEach((e) => {
      this.selectedCoworkings.push(e);
    });
    this.dateArray[0] = this.initDates["startDate"].format(this.formatDate);
    this.dateArray[1] = this.initDates["endDate"].format(this.formatDate);
  }

  ngOnDestroy(): void {
    this.translateServiceSubscription.unsubscribe();
  }

  /**
   * Se ejecuta en caso de que cambie el idioma
   */
  languageChange() {
    this.initDates ={
      startDate: moment(this.bookingDate.getValue().startDate.format(this.formatDate)),
      endDate: moment(this.bookingDate.getValue().endDate.format(this.formatDate))
    }
    this.bookingDate.setValue(this.initDates);
    this.locale=this.translate.getCurrentLang();
  }

  dateInitEnd(){
    return this.initDates;
  }

  onCoworkingChange(selectedNames: OValueChangeEvent) {
    if (selectedNames.type === 0) {
      if (selectedNames.newValue.length <= this.maxSelection) {
        this.selectedCoworkings = selectedNames.newValue;
        this.setDatesAndQueryBackend();
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

  setDates() {
    try {
      const startDateM = new Date(
        (this.bookingDate as any).value.value.startDate
      ).setHours(0, 0, 0, 0);
      const startDate = new Date(startDateM).toLocaleString("en-CA");
      const endDateM = new Date(
        (this.bookingDate as any).value.value.endDate
      ).setHours(0, 0, 0, 0);
      const endDate = new Date(endDateM).toLocaleString("en-CA");
      if (startDate === endDate) {
        this.showAvailableToast(
          this.translate.get("DATERANGE_SELECTION_ERROR")
        );
      } else {
        this.dateArray[0] = startDate;
        this.dateArray[1] = endDate;
        // Realizar una nueva consulta al backend con las fechas seleccionadas y los coworkings previamente seleccionados
        if (this.selectedCoworkings.length > 0) {
          this.setDatesAndQueryBackend();
        }
      }
    } catch (error) {
      console.error("Error al establecer fechas: ", error);
    }
  }

  private setDatesAndQueryBackend() {
    // Configuramos el filtro para enviar al backend
    let filter = {
      cw_id: this.selectedCoworkings,
      bk_date: this.dateArray,
    };
    const columns = ["bk_id"];
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);

    // Realizamos la consulta al backend con el nuevo rango de fechas
    this.service.query(filter, columns, "occupationLinearChart").subscribe(
      (resp) => {
        if (resp.data && resp.data.length > 0) {
          this.chartData = resp.data[0].data;
          this.isGraph = this.chartData.length > 0;
        } else {
            this.isGraph = false;
        }
      }
    );
  }

  getChartData() {
    if (this.chartData) {
      return this.chartData;
    }
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage = mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 7500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  getChartParameters() {
    return {
      tooltipDisabled: false,
      showTooltip: true,
      tooltips: true,
    };
  }
}

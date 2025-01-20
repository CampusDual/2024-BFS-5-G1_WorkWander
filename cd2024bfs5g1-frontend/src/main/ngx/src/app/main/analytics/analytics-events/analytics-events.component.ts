import {
  COMPILER_OPTIONS,
  Component,
  Injector,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  DayPilot,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent,
} from "@daypilot/daypilot-lite-angular";
import {
  OComboComponent,
  OntimizeService,
  OValueChangeEvent,
  OTranslateService,
  ODateRangeInputComponent,
  SnackBarService,
  FilterExpressionUtils,
  Expression,
  OSnackBarConfig,
} from "ontimize-web-ngx";
import { Subscription } from "rxjs";
import { UtilsService } from "src/app/shared/services/utils.service";

interface DateData {
  cw_capacity: number;
  date: number;
  plazasOcupadas: number;
}
@Component({
  selector: "app-analytics-events",
  templateUrl: "./analytics-events.component.html",
  styleUrls: ["./analytics-events.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AnalyticsEventsComponent implements OnInit {
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") navigator!: DayPilotNavigatorComponent;
  @ViewChild("month") day!: DayPilotMonthComponent;
  @ViewChild("month") week!: DayPilotMonthComponent;
  events: DayPilot.EventData[] = [];
  bookingsDataArray: DateData[] = [];
  service: OntimizeService;
  date = DayPilot.Date.today();
  backColor: string;
  private translateServiceSubscription: Subscription;
  selectedCoworking: number;
  coworkingLocation: string = "";
  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;
  @ViewChild("calendar") calendar: DayPilot.Month;

  constructor(
    private translate: OTranslateService,
    private utils: UtilsService,
    private injector: Injector,
    private snackBarService: SnackBarService
  ) {
    this.service = this.injector.get(OntimizeService);
    this.translateServiceSubscription =
      this.translate.onLanguageChanged.subscribe(() => {
        this.languageChange();
      });
  }

  ngOnInit(): void {
    this.languageChange();
    this.viewMonth();
  }

  ngOnDestroy(): void {
    this.translateServiceSubscription.unsubscribe();
  }

  languageChange() {
    let lang = this.translate.getCurrentLang() == "es" ? "es-ES" : "en-US";
    this.configMonth.locale = lang;
    this.configNavigator.locale = lang;
  }

  configMonth: DayPilot.MonthConfig = {
    theme: "verde",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    startDate: DayPilot.Date.today(),
    showToolTip: true,

    onBeforeCellRender: (args) => {
      if (!this.selectedCoworking || this.bookingsDataArray.length === 0) {
        // Si no hay coworking seleccionado, deja las celdas en blanco
        args.cell.properties.backColor = "white";
        return;
      }
      //Se adiciona el tooltip del porcentaje de ocupacion
      args.cell.properties.html =
      `<div style="position:absolute;right:2px;bottom:2px;font-size:8pt;color:#666;width:100%;height:100%;" 
      title="Sin reservas">
      </div>`; 
      let color = "rgba(226, 28, 0, 0.7)";
      // Normalizar la fecha de la celda eliminando la hora
      const cellDate = new Date(args.cell.start.toString()).setHours(0, 0, 0, 0);
      if (this.bookingsDataArray && this.bookingsDataArray.length > 0) {
        const cellData = this.bookingsDataArray.find((item) => new Date(item.date).setHours(0, 0, 0, 0) === cellDate);
        //Color de la celda por defecto si no hay ocupacion
        if (cellData) {
          const percentage =
            (cellData.plazasOcupadas / cellData.cw_capacity) * 100;
          color = this.getColorForPercentage(percentage);
          args.cell.properties.html =
          `<div style="position:absolute;right:2px;bottom:2px;font-size:8pt;color:#666;width:100%;height:100%;" 
           title="Ocupación: ${percentage.toFixed(2)}%">
          </div>`;      
        }
      }
      //Se adiciona el color de la celda según el porcentaje de ocupacion
      args.cell.properties.backColor = color;
      
    },
  };
  /**
   * @notices Obtiene el color para un porcentaje de ocupacion
   * @param percentage es el porcentaje de ocupacion del coworking en un dia
   */
  getColorForPercentage(percentage: number) {
    let r: number, g: number, b: number;

    if (percentage <= 50) {
      // De rojo (255, 0, 0) a amarillo (255, 255, 0)
      r = 255;
      g = Math.round(255 * (percentage / 50));
      b = 0;
    } else {
      // De amarillo (255, 255, 0) a verde (0, 255, 0)
      r = Math.round(255 * ((100 - percentage) / 50));
      g = 255;
      b = 0;
    }

    return `rgba(${r}, ${g}, ${b}, 0.7)`;
}
  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onTimeRangeSelected: (args) => {
      this.date = args.start;
      this.getCoworkingEventsData();
    }
  };
  async onCoworkingChange(selectedNames: OValueChangeEvent) {
    if (selectedNames.type === 0) {
      this.selectedCoworking = selectedNames.newValue;
      await this.getOccupationByMonth();
      this.getCoworkingEventsData();
    }
  }

  configureService(serviceName: string) {
    const conf = this.service.getDefaultServiceConfiguration(serviceName);
    this.service.configureService(conf);
  }
  
  /**
   * @notices Obtiene los eventos en la misma localidad de un coworking
   */
  getCoworkingEventsData() {
    if (this.selectedCoworking == undefined || this.selectedCoworking == null)
      return;
    this.events = [];
    const filter = { cw_id: this.selectedCoworking };
    const columns = ["name", "date_event", "hour_event", "duration"];
    this.configureService("events");
    this.service
      .query(filter, columns, "eventsNearCoworking")
      .subscribe((response) => {
        if (response.data && response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            const hour = "T" + this.utils.formatTime(response.data[i].hour_event) + ":00"
            const finalTime = this.createFinalTime(hour, response.data[i].duration)
            const date = new Date(response.data[i].date_event);
            let init = this.createInitDate(date) + hour;
            let last = this.createInitDate(date) + finalTime;
            const object = {
              id: i + 1,
              start: init,
              end: last,
              text: response.data[i].name,
            };
            this.events.push(object);
          }
        } 
      });
  }

  createInitDate(date: any): string {
    let day = date.getDate();
    let d = day < 10 ? "0" + day.toString() : day.toString();
    let month = date.getMonth() + 1;
    let m = this.convertMonth(month);
    const fullYear = date.getFullYear().toString();
    return fullYear + "-" + m + "-" + d;
  }

  convertMonth(n: number): string {
    let nResult = String(n);
    if (nResult.length == 1) nResult = "0" + nResult;
    return nResult;
  }

  createFinalTime(hour: any, duration: number) {
    let finalHour = "";
    let restMinutes = "";
    let min = 0;
    if (duration == undefined || duration == null) {
      duration = 0;
    }
    let h = parseInt(hour.substring(1, 3));
    let m = parseInt(hour.substring(4, 6));
    h = h * 60;
    m = duration + m + h;
    h = Math.floor(m / 60);
    m = Math.floor(m % 60);
    if (h >= 23 && m >= 59) {
      h = 23;
      m = 59;
    }
    if (h < 10) {
      finalHour = "0" + h.toString();
    } else {
      finalHour = h.toString();
    }
    if (m < 10) {
      restMinutes = "0" + m.toString();
    } else {
      restMinutes = m.toString();
    }
    return "T" + finalHour + ":" + restMinutes + ":" + "00";
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configMonth.visible = true;
    this.getCoworkingEventsData();
  }

  changeDate(date: DayPilot.Date): void {
    this.configMonth.startDate = date;
  }

  /**
   * @notice Función para construir la expresión de filtrado
   * @param values es un array de objetos para los filtros avanzados
   */
  createFilter(values: Array<{ attr: string; value: any }>): Expression {
    let coworkingExpressions: Array<Expression> = [];
    let daterangeExpressions: Array<Expression> = [];
    values.forEach((fil) => {
      if (fil.value) {
        if (fil.attr === "cw_id") {
          coworkingExpressions.push(
            FilterExpressionUtils.buildExpressionEquals(fil.attr, fil.value)
          );
        }
      }
    });
    // Construir expresión OR para coworkings
    let coworkingExpression: Expression = null;
    if (coworkingExpressions.length > 0) {
      coworkingExpression = coworkingExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_OR
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
    }
    // Construir expresión para combinar filtros avanzados
    const expressionsToCombine = [
      coworkingExpression,
      daterangeExpression,
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
    /**
   * @notices Obtiene la ocupacion de los coworkings para todos los dias de un mes
   */
    getOccupationByMonth(): Promise<DateData[]> {
      this.bookingsDataArray = [];
      return new Promise((resolve, reject) => {
      let occupationByDate: DateData[] = [];
      const year = this.date.getYear();
      const month = this.date.getMonth();
      // Obtener el primer día del mes
      const firstDay = new Date(year, month, 1);
      // Obtener el último día del mes
      const lastDay = new Date(year, month + 1, 0);

      const filterValues = [
        {
          attr: "cw_id",
          value: this.selectedCoworking,
        },
        {
          attr: "date",
          value: { startDate: firstDay.toLocaleDateString("en-Ca"), endDate: lastDay },
        },
      ];
      const filter = { "@basic_expression": this.createFilter(filterValues) };
      const sqlTypes = { date: 91 };
      this.configureService("coworkings");
      const columns = ["cw_capacity", "date", "plazasOcupadas"];

      // Realiza la consulta al backend con el rango de fechas
      this.service.query(filter, columns, "bookingsByMonth", sqlTypes).subscribe(
        (resp) => {
          if (resp) {
            this.bookingsDataArray = resp.data;
            resolve(resp.data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          console.error(this.translate.get("COWORKING_EVENTS_SELECTION_ERROR"), error);
          reject(error);
        }
      );
    });
  }
}

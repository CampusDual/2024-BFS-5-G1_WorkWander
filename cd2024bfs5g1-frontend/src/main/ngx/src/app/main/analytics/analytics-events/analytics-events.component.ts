import { COMPILER_OPTIONS, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent,
} from "@daypilot/daypilot-lite-angular";
import {
  OComboComponent,
  OntimizeService,
  OValueChangeEvent,
  OTranslateService,
  ODateRangeInputComponent,
  OSnackBarConfig,
  SnackBarService,
  FilterExpressionUtils,
  Expression,
} from "ontimize-web-ngx";
import { Subscription } from "rxjs";
import { UtilsService } from "src/app/shared/services/utils.service";


interface DateData {
  cw_capacity: number;
  date: string;
  plazasOcupadas: number;
}
@Component({
  selector: 'app-analytics-events',
  templateUrl: './analytics-events.component.html',
  styleUrls: ['./analytics-events.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AnalyticsEventsComponent implements OnInit {
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") navigator!: DayPilotNavigatorComponent;
  @ViewChild("month") day!: DayPilotMonthComponent;
  @ViewChild("month") week!: DayPilotMonthComponent;
  events: DayPilot.EventData[] = [];
  eventDays: Date[] = [];
  dataArray: DateData[] = [];
  occupationByDay: Object[] = [];
  daysInMonth: number;
  service: OntimizeService;
  date = DayPilot.Date.today();


  occupationByDate: number;
  backColor: string;
  percentage: number;
  private translateServiceSubscription: Subscription;
  selectedCoworking: number;
  coworkingLocation: string = "";
  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;



  public dateArray = [];

  constructor(
    private translate: OTranslateService,
    private utils: UtilsService,
    private injector: Injector,
    private snackBarService: SnackBarService,
  ) {
    this.service = this.injector.get(OntimizeService);
    this.translateServiceSubscription = this.translate.onLanguageChanged.subscribe(() => {
      this.languageChange();
    });
  }

  ngOnInit(): void {
    this.dataArray = [];
    this.languageChange();
    this.viewMonth();
  }

  ngOnDestroy(): void {
    this.translateServiceSubscription.unsubscribe();
  }

  formatShortDate(rawDate: number): string {
    if (rawDate) {
      return this.utils.formatShortDate(rawDate);
    }
  }

  languageChange() {
    let lang = this.translate.getCurrentLang() == 'es' ? 'es-ES' : 'en-US';
    this.configDay.locale = lang;
    this.configMonth.locale = lang;
    this.configWeek.locale = lang;
    this.configNavigator.locale = lang;
  }
  public respdata = [
    {
      "cw_capacity": 40,
      "date": "2025-01-13",
      "plazasOcupadas": 13
    },
    {
      "cw_capacity": 40,
      "date": "2025-01-14",
      "plazasOcupadas": 3
    },
    {
      "cw_capacity": 40,
      "date": "2025-01-15",
      "plazasOcupadas": 29
    },
    {
      "cw_capacity": 40,
      "date": "2025-01-16",
      "plazasOcupadas": 39
    }
  ]

  configMonth: DayPilot.MonthConfig = {
    theme: "verde",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    startDate: DayPilot.Date.today(),
    onBeforeCellRender: (args) => {
      console.log("dataArray", this.dataArray);
      const cellDate = args.cell.start.toString("yyyy-MM-dd");
      // const cellData = this.respdata.find(item => item.date === cellDate);
      const cellData = this.dataArray.find(item => item.date === cellDate);
      // const cellData = this.dataArray.find(d => "2025-01-13" === date);
      if (cellData) {
        const percentage = (cellData.plazasOcupadas / cellData.cw_capacity) * 100;
        // Asigna el color basado en el porcentaje
        if (percentage <= 25) {
          args.cell.properties.backColor = "red";
        } else if (percentage <= 50) {
          args.cell.properties.backColor = "orange";
        } else if (percentage <= 75) {
          args.cell.properties.backColor = "yellow";
        } else {
          args.cell.properties.backColor = "green";
        }
      }
    }
  };

  configWeek: DayPilot.CalendarConfig = {
    theme: "verde",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    startDate: DayPilot.Date.today(),
    viewType: "Week"
  };

  configDay: DayPilot.CalendarConfig = {
    theme: "verde",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    startDate: DayPilot.Date.today(),
    viewType: "Day"
  };

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: (args) => {
      this.onTimeRangeSelected(args);
      this.getCoworkingEventsData();
    },
  };

  configureService(serviceName: string) {
    const conf = this.service.getDefaultServiceConfiguration(serviceName);
    this.service.configureService(conf);
  }
  // onBeforeCellRender(args: any) {
  //   const cell = args.cell;
  //   const date = cell.date;

  //   // Ejemplo: Cambiar el color de fondo de la celda de un día específico
  //   if (date.day() === 1) {
  //     // Cambiar la clase CSS de la celda
  //     cell.cssClass = "special-day";
  //   } else {
  //     cell.cssClass = "regular-day";
  //   }

  //   cell.style.backgroundColor = 'lightblue'; // Establece un color específico
  // }


  getCoworkingEventsData() {
    if (this.selectedCoworking == undefined || this.selectedCoworking == null) return;
    this.events = [];
    this.eventDays = [];
    const filter = { cw_id: this.selectedCoworking };
    const columns = ["name", "date_event", "hour_event", "duration"];
    // const serviceConfig = this.configureService("eventsNearCoworking");
    // const conf = this.service.getDefaultServiceConfiguration("events");
    // this.service.configureService(conf);
    this.configureService("events");

    this.service
      .query(filter, columns, "eventsNearCoworking")
      .subscribe((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.eventDays.push(new Date(response.data[i].date_event));
          const hour = "T" + this.utils.formatTime(response.data[i].hour_event) + ":00"
          const finalTime = this.createFinalTime(hour, response.data[i].duration)
          const date = new Date(response.data[i].date_event);
          let init = this.createInitDate(date) + hour;
          let last = this.createInitDate(date) + finalTime;
          // const event_Date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          // const event_Date = "2024-12-04";
          // const formattedDate = event_Date.replace(/\//g, "-");

          // console.log("event_Date", event_Date);
          // console.log("response.data[i].date_event", response.data[i].date_event);
          // console.log("date", date);
          // const {bookings, capacity, percentage, backColor} = this.getBookingOccupation(this.selectedCoworking, date);
          const object = {
            id: i + 1,
            start: init,
            end: last,
            text: response.data[i].name,
            // text: `${response.data[i].name}  ${percentage}%`,
            // // tooltip: percentage,
            // tooltip: "PORRAS",
            // bookings: bookings,
            // capacity: capacity,
            // // backColor: "#7ba587"
            // backColor: backColor
          }
          // console.log("response.data.length", response.data.length);
          this.events.push(object);
        }
      });
  }


  createInitDate(date: any): string {
    let day = date.getDate()
    let d = day < 10 ? '0' + day.toString() : day.toString();
    let month = date.getMonth() + 1;
    let m = this.convertMonth(month);
    const fullYear = date.getFullYear().toString();
    return fullYear + "-" + m + "-" + d;
  }

  convertMonth(n: number): string {
    let nResult = String(n)
    if (nResult.length == 1)
      nResult = '0' + nResult
    return nResult
  }

  createFinalTime(hour: any, duration: number) {
    let finalHour = "";
    let restMinutes = "";
    let min = 0;
    if (duration == undefined || duration == null) {
      duration = 0;
    }
    let h = parseInt(hour.substring(1, 3))
    let m = parseInt(hour.substring(4, 6))
    h = h * 60
    m = duration + m + h
    h = Math.floor(m / 60);
    m = Math.floor(m % 60);
    if (h >= 23 && m >= 59) {
      h = 23;
      m = 59;
    }
    if (h < 10) {
      finalHour = "0" + h.toString()
    } else {
      finalHour = h.toString()
    }
    if (m < 10) {
      restMinutes = "0" + m.toString()
    } else {
      restMinutes = m.toString()
    }
    return "T" + finalHour + ":" + restMinutes + ":" + "00"
  }

  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
    this.getCoworkingEventsData();
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
    this.getCoworkingEventsData();
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
    this.getCoworkingEventsData();
    this.onTimeRangeSelected(this.configMonth);
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  onCoworkingChange(selectedNames: OValueChangeEvent) {
    if (selectedNames.type === 0) {
      this.dataArray = [];
      this.selectedCoworking = selectedNames.newValue;
      console.log("selectedNames.newValue: ", this.selectedCoworking);
      // this.occupationByDay = [];
      // this.getOccupation(this.selectedCoworking, this.configMonth.startDate);
      this.getOccupationByMonth();
      this.getCoworkingEventsData();
      // this.showEvents(4560);
      // this.getOccupation(this.selectedCoworking, this.configMonth.startDate);
      // this.getOcuppationByDay(this.selectedCoworking, '2025-02-22');
    }
  }
  onTimeRangeSelected(args: any) {
    console.log("HOLA2");
    // console.log("onTimeRangeSelected", args);
    const startDate = args.startDate; // Fecha inicial seleccionada
    if (!startDate) return;
    // Convierte DayPilot.Date a un objeto Date nativo de JavaScript
    const nativeDate = startDate.toDate(); // Convierte a un objeto Date

    // Accede al año y mes
    const year = nativeDate.getFullYear(); // Obtiene el año completo
    const month = nativeDate.getMonth() + 1; // Obtiene el mes (base 0, por lo que sumamos 1)

    // Calcula los días en el mes
    // this.daysInMonth = this.getDaysInMonth(year, month);
    this.daysInMonth = new Date(year, month, 0).getDate();
    console.log(`El mes ${month} del año ${year} tiene ${this.daysInMonth} días.`);
  }

  async getOccupation(bk_cw_id: number, date: any) {
    console.log("DATA-getOccupation", bk_cw_id, date);
    try {
      console.log("this.daysInMonth", this.daysInMonth);
      // Limpiar el array antes de llenarlo con los nuevos valores
      this.occupationByDay = [];

      // Obtener el año y el mes de la fecha proporcionada
      const year = date.getYear();
      const month = date.getMonth();
      const monthString = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
      // Determinar el número de días en el mes
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      console.log("year-month", year, month, monthString, daysInMonth);

      // Obtener el primer día del mes
      const firstDay = new Date(year, month, 1);
      // Obtener el último día del mes
      const lastDay = new Date(year, month + 1, 0);
      console.log("firstDay", firstDay, "lastDay", lastDay);
      const array = [{ "cw_capacity": 40, "date": 1738710000000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1738796400000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1738882800000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1740006000000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1740092400000, "plazasOcupadas": 2 }, { "cw_capacity": 40, "date": 1740178800000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1740438000000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1740524400000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1740610800000, "plazasOcupadas": 1 }, { "cw_capacity": 40, "date": 1740697200000, "plazasOcupadas": 1 }]
      const convertedArray = array.map(item => {
        const date = new Date(item.date);
        const formattedDate = date.toISOString().split('T')[0];
        return { ...item, date: formattedDate };
      });
      // Loop para recorrer los días del mes
      for (let i = 1; i <= convertedArray.length; i++) {
        // const day = i < 10 ? `0${i}` : i.toString();
        // Asegura de que el día esté en el formato correcto
        const dayString = i < 10 ? `0${i}` : `${i}`;

        // Construir la fecha en formato 'YYYY-MM-DD'
        const searchedDate = `${year}-${monthString}-${dayString}`;

        // Esperamos la respuesta de getBookingOccupation de manera asincrónica
        //---**** const result = await this.getBookingOccupation(bk_cw_id, searchedDate);---****//IMPORTANTE
        const result = [0];
        if (result) {
          // const { bookings, cw_capacity, date } = result;  // Desestructuración solo si result no es null
          // const plazasOcupadas =  bookings;
          // const percentage = parseFloat(((plazasOcupadas / cw_capacity) * 100).toFixed(2));

          // let backColor = "";
          // if (percentage <= 25) {
          //   backColor = "#f63427";
          // } else if (percentage <= 50) {
          //   backColor = "#f49542";
          // } else if (percentage <= 75) {
          //   backColor = "#988c0a";
          // } else {
          //   backColor = "#6c9678";
          // }

          // // const object = {
          // //   capacity: cw_capacity,
          // //   dates:  bookings,
          // //   percentage: percentage,
          // //   backColor: backColor
          // // };
          // const object={
          //   "cw_capacity": cw_capacity,
          //   "date": date,
          //   "plazasOcupadas": plazasOcupadas
          // }

          // // Agregamos el objeto al array
          // this.occupationByDay.push(object);
          // this.dataArray.push(object);
          const date = new Date(array[i].date);
          console.log("date", date, "date.getTime()", date.getTime(), "searchedDate", searchedDate);
          if (convertedArray[i].date === searchedDate) {

            console.log("array[i]", convertedArray[i]);
            this.dataArray.push(convertedArray[i]);

          } else {
            this.occupationByDay.push(null);
            console.log(`Skipping ${searchedDate} as no data was returned.`);
          }
        }
      }

      console.log("this.occupationByDay", this.occupationByDay);
    } catch (error) {
      console.error("Error while fetching occupation data:", error);
    }
  }


  // showAvailableToast(mensaje?: string) {
  //   const availableMessage = mensaje;
  //   const configuration: OSnackBarConfig = {
  //     milliseconds: 7500,
  //     icon: "info",
  //     iconPosition: "left",
  //   };
  //   this.snackBarService.open(availableMessage, configuration);
  // }

  createFilter(values: Array<{ attr: string; value: any }>): Expression {
    let coworkingExpressions: Array<Expression> = [];
    let daterangeExpressions: Array<Expression> = [];
    let dateNullExpression: Expression;
    values.forEach((fil) => {
      if (fil.value) {
        if (fil.attr === "cw_id") {
          if (Array.isArray(fil.value)) {
            fil.value.forEach((val) => {
              coworkingExpressions.push(
                FilterExpressionUtils.buildExpressionLike(fil.attr, val)
              );
            });
          } else {
            coworkingExpressions.push(
              FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value)
            );
          }
        } else if (fil.attr == "date") {
          daterangeExpressions.push(
            FilterExpressionUtils.buildExpressionMoreEqual(
              fil.attr,
              fil.value.startDate
            )
          );
          daterangeExpressions.push(
            FilterExpressionUtils.buildExpressionLessEqual(
              fil.attr,
              fil.value.endDate
            )
          );
          dateNullExpression = FilterExpressionUtils.buildExpressionIsNull(
            fil.attr
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
       daterangeExpression = FilterExpressionUtils.buildComplexExpression(
         daterangeExpression,
         dateNullExpression,
         FilterExpressionUtils.OP_AND
       );
     }
     // Construir expresión para combinar filtros avanzados
    const expressionsToCombine = [
      coworkingExpression,
      daterangeExpression
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
  getOccupationByMonth() {
    // const filter = { bk_cw_id: cw_id, date: new Date('2024-11-13').toISOString().split('T')[0]};
    // const filter = { coworking_id: this.selectedCoworking, date: new Date().toISOString().split('T')[0] };
    const year = this.date.getYear();
    const month = this.date.getMonth();
    const monthString = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    // Determinar el número de días en el mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    console.log("year-month", year, month, monthString, daysInMonth);
    // Obtener el primer día del mes
    const firstDay = new Date(year, month, 1);
    // Obtener el último día del mes
    const lastDay = new Date(year, month + 1, 0);
    console.log("firstDay", firstDay, "lastDay", lastDay);
    // const startDate = DayPilot.Date.today();
    // const endDate = DayPilot.Date.today().addMonths(1);
    // console.log("startDate", startDate, "endDate", endDate);
    console.log("startDate", firstDay, "endDate", lastDay);
    const filterValues = [
      {
        attr: "cw_id", value: this.selectedCoworking.toString()
      },
      {
        attr: "date", value: { startDate: firstDay, endDate: lastDay }
      }
    ]
    console.log("filterValues", filterValues);
    const _filterValues = [
      { attr: "cw_id", value: 40 }, // Filtrar por IDs específicos
      {
        attr: "date",
        value: {
          startDate: "2025-01-01",
          endDate: "2025-01-31",
        },
      },
    ];

    const resp_data = [
      {
        "cw_capacity": 40,
        "date": "2025-01-13",
        "plazasOcupadas": 1
      },
      {
        "cw_capacity": 40,
        "date": "2025-01-14",
        "plazasOcupadas": 1
      },
      {
        "cw_capacity": 40,
        "date": "2025-01-15",
        "plazasOcupadas": 1
      },
      {
        "cw_capacity": 40,
        "date": "2025-01-16",
        "plazasOcupadas": 1
      }
    ]
    for (let i = 0; i < resp_data.length; i++) {
      // resp_data[i].date = new Date(resp_data[i].date);
      if (resp_data && resp_data.length > 0) {
        console.log("occupationByDate: ", resp_data[i]);
        // return this.occupationByDate = resp.data[0];
        this.dataArray.push(resp_data[i]);
      } else {
        return null;
      }
    }

    const filter = this.createFilter(filterValues); 
    const _filter = {
      "@basic_expression": {
        lop: {
          lop: "cw_id",
          op: "=",
          rop: this.selectedCoworking,
        },
        op: "AND",
        rop: {
          lop: {
            lop: "startDate",
            op: ">=",
            rop: '2025-01-01',
          },
          op: "AND",
          rop: {
            lop: {
              lop: "endDate",
              op: "<=",
              rop: '2025-01-31',
            }
          }
        }
      }
    };
    let sqltypes = {
      date_event: 91,
    }
    // const filter = { cw_id: 40, startDate:'2025-01-01', endDate:'2025-01-31'};
    const sqlTypes = { date: 91 };
    // const conf = this.service.getDefaultServiceConfiguration("bookings");
    // this.service.configureService(conf);
    this.configureService("bookings");
    const columns = ['cw_capacity', 'date', 'plazasOcupadas'];

    // Realizamos la consulta al backend con el nuevo rango de fechas
    this.service.query(filter, columns, "bookingsByMonth", sqlTypes).subscribe(
      (resp) => {
        console.log("RESPONSE.data: ", resp.data);
        if (resp.data && resp.data.length > 0) {
          console.log("occupationByDate: ", resp.data[0]);
          // return this.occupationByDate = resp.data[0];
        } else {
          return null;
        }
      },
      (error) => {
        console.error(
          this.translate.get("COWORKING_EVENTS_SELECTION_ERROR"),
          error
        );
      }
    );
    console.log("occupationByDate", this.occupationByDate)
    return this.occupationByDate;
  }

  // getOcuppationByDay(bk_cw_id: number, date_event: String) {
  getOcuppationByDay(bk_cw_id: number, date_event: String, callback: (data: any) => void) {
    console.log("Hola");
    // console.log("DATA: ", bk_cw_id, date_event);
    if (bk_cw_id == undefined || bk_cw_id == null || date_event == undefined || date_event == null) return;
    // const filter = { bk_cw_id: cw_id, date: new Date('2024-11-13').toISOString().split('T')[0]};
    const filter = { bk_cw_id: bk_cw_id, date: date_event };
    const sqlTypes = { date: 91 };
    // const conf = this.service.getDefaultServiceConfiguration("bookings");
    // this.service.configureService(conf);
    this.configureService("bookings");
    const columns = ['bookings', 'cw_capacity', 'date']; // Solo se trae la columna necesaria

    // Realizamos la consulta al backend con el nuevo rango de fechas
    // this.service.query(filter, columns, "occupationByDate").subscribe(
    this.service.query(filter, columns, "bookingsByDay", sqlTypes).subscribe(
      (resp) => {
        console.log("RESPONSE.data: ", resp.data);
        if (resp.data && resp.data.length > 0) {
          console.log("occupationByDate: ", resp.data[0]);
          // return this.occupationByDate = resp.data[0];
          callback(this.occupationByDate);
        } else {
          // return null;
          callback(null);
        }
      },
      (error) => {
        console.error(
          this.translate.get("COWORKING_EVENTS_SELECTION_ERROR"),
          error
        );
        callback(null);
      }
    );
    // console.log("occupationByDate", this.occupationByDate)
    // return this.occupationByDate;
  }
  getBookingOccupation(bk_cw_id: number, date: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log("bk_cw_id", bk_cw_id, "date", date);
      const filter = { bk_cw_id: bk_cw_id, date: date };
      const sqlTypes = { date: 91 };
      this.configureService("bookings");
      const columns = ['bookings', 'cw_capacity', 'date'];

      this.service.query(filter, columns, "bookingsByDay", sqlTypes).subscribe(
        (resp) => {
          // console.log("RESP:", resp);
          if (resp.data && resp.data.length > 0) {
            // console.log("resp.data", resp.data);
            resolve(resp.data[0]); // Resolvemos la promesa con los datos
          } else {
            console.error("No data found");
            // reject('No data found');
            resolve(null);
          }
        },
        (error) => {
          console.error("Error in service query:", error);
          reject(error);
        }
      );
    });
  }

}
// {lop: "cw_location", op: "LIKE", rop: "%A Coruña%"}
// lop
// : 
// "cw_location"
// op
// : 
// "LIKE"
// rop
// : 
// "%A Coruña%"
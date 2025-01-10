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
} from "ontimize-web-ngx";
import { Subscription } from "rxjs";
import { UtilsService } from "src/app/shared/services/utils.service";

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
  service: OntimizeService;
  date = DayPilot.Date.today();
  occupationByDate: number;
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
    this.languageChange();
    this.configureService();
    this.viewMonth();
    // this.getCoworkingLocationById("1");
  }

  ngOnDestroy(): void {
    this.translateServiceSubscription.unsubscribe();
  }

  languageChange() {
    let lang = this.translate.getCurrentLang() == 'es' ? 'es-ES' : 'en-US';
    this.configDay.locale = lang;
    this.configMonth.locale = lang;
    this.configWeek.locale = lang;
    this.configNavigator.locale = lang;
  }

  configMonth: DayPilot.MonthConfig = {
    theme: "verde",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    startDate: DayPilot.Date.today()
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
      this.getCoworkingEventsData();
    },
  };


  configureService() {
    const conf = this.service.getDefaultServiceConfiguration("events");
    this.service.configureService(conf);
  }

  getCoworkingEventsData() {
    if (this.selectedCoworking == undefined || this.selectedCoworking == null) return;
    this.events = [];
    this.eventDays = [];
    const filter = {cw_id: this.selectedCoworking};
    const columns = ["name", "date_event", "hour_event", "duration"];
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
          const object = {
            id: i + 1,
            start: init,
            end: last,
            text: response.data[i].name, 
            backColor: "#7ba587"
          }
          this.events.push(object);
        } });
  }
  showEvents(cw_location: number): void {
    if (cw_location != undefined) {
      let date = new Date();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let day = date.getDate();
      let m = month < 10 ? "0" + month.toString() : month.toString();
      let d = day < 10 ? "0" + day.toString() : day.toString();
      let now = `${year}-${m}-${d}`;
      const filter = {
        "@basic_expression": {
          lop: {
            lop: "locality",
            op: "=",
            rop: cw_location,
          },
          op: "AND",
          rop: {
            lop: "date_event",
            op: ">=",
            rop: now,
          },
        },
      };
      let sqltypes = {
        date_event: 91,
      };
      const conf = this.service.getDefaultServiceConfiguration("events");
      this.service.configureService(conf);
      const columns = [
        "id_event",
        "name",
        "description",
        "date_event",
        "hour_event",
        "address",
        "location",
        "bookings",
        "usr_id",
        "duration",
        "image_event",
      ];
      this.events = [];
      this.service
        .query(filter, columns, "event", sqltypes)
        .subscribe((resp) => {
          if (resp.code === 0 && resp.data.length > 0) {
            console.log("resp.data.length: " + resp.data.length);
            this.events = resp.data;
            this.events.sort(function (a: any, b: any) {
              console.log("resp.data.event_date: " + resp.data);
              return a.date_event - b.date_event;
            });
          }else{
              this.showAvailableToast("No hay eventos disponibles en coworkings.");
            return;
          }
        });
    }
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
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  onCoworkingChange(selectedNames: OValueChangeEvent) {
    if (selectedNames.type === 0) {
      console.log("selectedNames.type: ", selectedNames.type);
      console.log("selectedNames.newValue: ", selectedNames.newValue);
        this.selectedCoworking = selectedNames.newValue;
        console.log("selectedNames.newValue2: ", this.selectedCoworking);
        this.getCoworkingEventsData();
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

  getOcuppationByDay(cw_id: number, date_event: Date) {
    if (cw_id == undefined || cw_id == null || date_event == undefined || date_event == null) return;
    const filter = { cw_id: cw_id, booking_date: date_event };
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    console.log("filter: ", filter.cw_id, filter.booking_date);
    this.service.configureService(conf);
    const columns = ['dates']; // Solo se trae la columna necesaria

    // Realizamos la consulta al backend con el nuevo rango de fechas
    this.service.query(filter, columns, "occupationByDate").subscribe(
      (resp) => {
        if (resp.data && resp.data.length > 0) {
          // console.log("occupationByDate: ", resp.data[0]);
          return this.occupationByDate = resp.data[0];
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
    return this.occupationByDate;
  }
  
}

import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent,
} from "@daypilot/daypilot-lite-angular";
import {
  OTranslateService,
  OFormComponent,
  OntimizeService,
} from "ontimize-web-ngx";
import { Subscription } from "rxjs";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-my-calendar-home",
  templateUrl: "./my-calendar-home.component.html",
  styleUrls: ["./my-calendar-home.component.css"],
})
export class MyCalendarHomeComponent implements OnInit {
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") navigator!: DayPilotNavigatorComponent;
  @ViewChild("month") day!: DayPilotMonthComponent;
  @ViewChild("month") week!: DayPilotMonthComponent;
  events: DayPilot.EventData[] = [];

  service: OntimizeService;
  color: string = "";
  date = DayPilot.Date.today();
  private translateServiceSubscription: Subscription;

  constructor(
    private translate: OTranslateService,
    private utils: UtilsService,
    private injector: Injector
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
      this.getData();
    },
  };


  configureService() {
    const conf = this.service.getDefaultServiceConfiguration("events");
    this.service.configureService(conf);
  }

  getData() {
    this.events = [];
    const filter = {};
    const columns = ["name", "date_event", "hour_event", "duration"];
    this.service
      .query(filter, columns, "myEventsCalendar")
      .subscribe((response) => {
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
            text: response.data[i].name
          }
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
    this.getData();
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
    this.getData();
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
    this.getData();
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }
}

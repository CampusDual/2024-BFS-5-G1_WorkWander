import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
} from "@angular/core";
import { ViewChild } from "@angular/core";
import {
  OComboComponent,
  OntimizeService,
  OSnackBarConfig,
  OValueChangeEvent,
  SnackBarService,
  OTranslateService,
  ODateRangeInputComponent,
} from "ontimize-web-ngx";
@Component({
  selector: "app-analytics-occupation",
  templateUrl: "./analytics-occupation.component.html",
  styleUrls: ["./analytics-occupation.component.css"],
  encapsulation: ViewEncapsulation.None,
  host: { "[class.custom-chart]": "true" },
})
export class AnalyticsOccupationComponent {
  selectedCoworkings: string[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  selectedCoworking: string = "";
  chartParameters: any;
  maxSelection = 3;
  colorScheme = ["#5AA454", "#A10A28", "#C7B42C"];
  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;

  public dateArray = [];

  constructor(
    private service: OntimizeService,
    private cd: ChangeDetectorRef,
    private snackBarService: SnackBarService,
    private translate: OTranslateService
  ) {}
  onCoworkingChange(selectednames: OValueChangeEvent) {
    if (selectednames.type === 0) {
      if (selectednames.newValue.length <= this.maxSelection) {
        this.selectedCoworkings = selectednames.newValue;
        this.selectedCoworking = this.selectedCoworkings.join(",");
        this.showAvailableToast(
          `${this.translate.get(
            "COWORKING_CHART_SELECTION"
          )} ${this.selectedCoworkings.join(", ")}`
        );
      } else {
        this.comboCoworkingInput.setValue(selectednames.oldValue);
        this.showAvailableToast(
          this.translate.get("COWORKING_CHART_SELECTION_LIMIT") +
            this.maxSelection
        );
        return;
      }
      const conf = this.service.getDefaultServiceConfiguration("bookings");
      this.service.configureService(conf);
      const filter = { cw_id: this.selectedCoworkings };
      const columns = ["data"];
      this.service.query(filter, columns, "occupationLinearChart").subscribe(
        (resp) => {
          if (resp.data && resp.data.length > 0) {
            this.chartData = resp.data[0].data;
            this.isGraph = this.chartData.length > 0;
          } else {
            this.isGraph = false;
          }
        },
        (error) => {
          console.error(
            this.translate.get("COWORKING_CHART_SELECTION_ERROR"),
            error
          );
          this.isGraph = false;
        }
      );
    }
  }
  getChartData() {
    if (this.chartData) {
      return this.chartData;
    }
  }
  setDates() {
    const startDate = new Date(
      (this.bookingDate as any).value.value.startDate
    ).toLocaleString("en-CA");
    const endDate = new Date(
      (this.bookingDate as any).value.value.endDate
    ).toLocaleString("en-CA");

    this.dateArray[0] = startDate;
    this.dateArray[1] = endDate;

    const filter = {
      cw_id: this.selectedCoworkings,
      bk_date: this.dateArray,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];

    this.service.query(filter, columns, "occupationLinearChart").subscribe(
      (resp) => {
        const data = resp.data.data;
      },
      (error) => {
        console.error("Error al consultar capacidad:", error);
      }
    );
    this.dateArray.splice(0, this.dateArray.length);
  }

  changeFormatDate(milis: number, idioma: string) {
    const fecha = new Date(milis);
    let fechaFormateada;
    fechaFormateada = new Intl.DateTimeFormat(idioma).format(fecha);
    return fechaFormateada;
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
}

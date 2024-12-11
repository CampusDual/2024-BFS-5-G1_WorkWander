import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
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
  styleUrls: ["./analytics-occupation.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { "[class.custom-chart]": "true" },
})
export class AnalyticsOccupationComponent {
  selectedCoworkings: string[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  maxSelection = 3;
  chartParameters: any;

  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;

  public dateArray = [];

  constructor(
    private service: OntimizeService,
    private snackBarService: SnackBarService,
    private translate: OTranslateService
  ) {}

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
    const filter = {
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

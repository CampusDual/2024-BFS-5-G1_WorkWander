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
} from "ontimize-web-ngx";
@Component({
  selector: "app-analytics-occupation",
  templateUrl: "./analytics-occupation.component.html",
  styleUrls: ["./analytics-occupation.component.css"],

  encapsulation: ViewEncapsulation.None,
  host: {
    "[class.custom-chart]": "true",
  },
})
export class AnalyticsOccupationComponent {
  selectedCoworkings: string[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  selectedCoworking: string = "";
  chartParameters: any;
  colorScheme = ["#5AA454", "#A10A28", "#C7B42C"];

  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;

  constructor(
    private service: OntimizeService,
    private cd: ChangeDetectorRef,
    private snackBarService: SnackBarService,
    private translate: OTranslateService
  ) {}

  onCoworkingChange(selectednames: OValueChangeEvent) {
    if (selectednames.newValue.length <= 3) {
      this.selectedCoworkings = selectednames.newValue;
      this.selectedCoworking = this.selectedCoworkings.join(",");
      this.showAvailableToast(
        `${this.translate.get(
          "COWORKING_CHART_SELECTION"
        )} ${this.selectedCoworkings.join(", ")}`
      );
    } else {
      this.comboCoworkingInput.setValue(this.selectedCoworkings);
      this.showAvailableToast(
        this.translate.get("COWORKING_CHART_SELECTION_LIMIT")
      );
    }
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const filter = {
      cw_id: this.selectedCoworkings,
    };
    const columns = ["data"];
    this.service.query(filter, columns, "occupationLinearChart").subscribe(
      (resp) => {
        if (resp.data && resp.data.length > 0) {
          this.chartData=resp.data;
          /**const data = resp.data[0].data;
          this.chartData = this.transformOccupationData(data);*/
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

  transformOccupationData(data: any): any[] {
    if (data[this.selectedCoworking]) {
      const dateMap = data[this.selectedCoworking];
      for (const [date, percentage] of Object.entries(dateMap)) {
        this.chartData.push({
          name: new Date(date).toLocaleDateString(),
          value: percentage,
        });
      }
    }
    return this.chartData;
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

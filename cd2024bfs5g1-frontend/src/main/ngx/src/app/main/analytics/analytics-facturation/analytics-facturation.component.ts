import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {OComboComponent,
  OntimizeService,
  OSnackBarConfig,
  OValueChangeEvent,
  SnackBarService,
  OTranslateService} from "ontimize-web-ngx";

@Component({
  selector: 'app-analytics-facturation',
  templateUrl: './analytics-facturation.component.html',
  styleUrls: ['./analytics-facturation.component.scss']
})
export class AnalyticsFacturationComponent {
  selectedCoworkings: string[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  maxSelection = 3;
  months:string [] = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;
  @ViewChild("comboMonthInput") comboMonthInput: OComboComponent;

  constructor(
    private service: OntimizeService,
    private snackBarService: SnackBarService,
    private translate: OTranslateService,
  ) {}

  onCoworkingChange(selectedNames: OValueChangeEvent) {
    if (selectedNames.type === 0) {
      if (selectedNames.newValue.length <= this.maxSelection) {
        this.selectedCoworkings = selectedNames.newValue;
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

  setMonth(){
    console.log(this.comboMonthInput.getValue())
    let filter = {
      "cw_name": this.selectedCoworkings,
      "date_part('month', public.booking_date.date)": this.comboMonthInput
    };
    let columns = ["coworking_name", "acount"];
    let configurationService = this.service.getDefaultServiceConfiguration("coworkings")
    this.service.configureService(configurationService);
    this.service.query(filter, columns, "coworkingFacturationChart")
    .subscribe(response => {
      if (response.data && response.data.length > 0) {
        this.chartData = response.data[0].data;
        this.isGraph = this.chartData.length > 0;
      }else{
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

}

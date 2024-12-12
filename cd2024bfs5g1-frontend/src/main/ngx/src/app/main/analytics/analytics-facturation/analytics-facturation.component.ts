import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {OComboComponent,
  OntimizeService,
  OSnackBarConfig,
  OValueChangeEvent,
  SnackBarService,
  OTranslateService} from "ontimize-web-ngx";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-facturation',
  templateUrl: './analytics-facturation.component.html',
  styleUrls: ['./analytics-facturation.component.scss']
})
export class AnalyticsFacturationComponent implements OnInit, OnDestroy{
  selectedCoworkings: string[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  maxSelection = 3;
  private translateServiceSubscription :Subscription;
  months:string [] = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  listOfMonths:any[]=[]

  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;
  @ViewChild("comboMonthInput") comboMonthInput: OComboComponent;

  constructor(
    private service: OntimizeService,
    private snackBarService: SnackBarService,
    private translate: OTranslateService,
  ) {
    this.translateServiceSubscription = this.translate.onLanguageChanged.subscribe(() => {
      this.languageChange();
    });
  }
  ngOnDestroy(): void {
    this.translateServiceSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.languageChange();
  }

  languageChange(){
      this.listOfMonths=[];
      this.listOfMonths=[
        {
          "id":1,
          "name":this.translate.get("JANUARY"),
        },
        {
          "id":2,
          "name":this.translate.get("FEBRUARY"),
        },
        {
          "id":3,
          "name":this.translate.get("MARCH"),
        },
        {
          "id":4,
          "name":this.translate.get("APRIL"),
        },
        {
          "id":5,
          "name":this.translate.get("MAY"),
        },
        {
          "id":6,
          "name":this.translate.get("JUNE"),
        },
        {
          "id":7,
          "name":this.translate.get("JULY"),
        },
        {
          "id":8,
          "name":this.translate.get("AUGUST"),
        },
        {
          "id":9,
          "name":this.translate.get("SEPTEMBER"),
        },
        {
          "id":10,
          "name":this.translate.get("OCTOBER"),
        },
        {
          "id":11,
          "name":this.translate.get("NOVEMBER"),
        },
        {
          "id":12,
          "name":this.translate.get("DECEMBER"),
        }
      ];
  }

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
    let month = this.comboMonthInput.getValue()
    let filter = {
      "cw_id": this.selectedCoworkings,
      "month": month
    };
    let columns = ["coworking_name", "account"];
    let sqltypes = {coworking_name:12, account:4}
    let configurationService = this.service.getDefaultServiceConfiguration("coworkings")
    this.service.configureService(configurationService);
    this.service.query(filter, columns, "coworkingFacturationChart", sqltypes)
    .subscribe((response) => {
      if (response.data && response.data.length > 0) {
        console.log(response.data)
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

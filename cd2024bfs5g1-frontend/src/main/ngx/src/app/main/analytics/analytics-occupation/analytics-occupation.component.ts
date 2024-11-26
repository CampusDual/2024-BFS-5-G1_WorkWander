import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ViewChild } from '@angular/core';

import {
  OComboComponent,
  OntimizeService,
  OSnackBarConfig,
  OValueChangeEvent,
  SnackBarService,
} from "ontimize-web-ngx";

@Component({
  selector: "app-analytics-occupation",
  templateUrl: "./analytics-occupation.component.html",
  styleUrls: ["./analytics-occupation.component.css"],
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
    private snackBarService: SnackBarService
  ) {}

  onCoworkingChange(selectednames: OValueChangeEvent) {
    if (selectednames.newValue.length <= 3) {
      this.selectedCoworkings = selectednames.newValue;
      this.selectedCoworking = this.selectedCoworkings.join(",");
      this.showAvailableToast(
        `Selected coworkings: ${this.selectedCoworkings.join(", ")}`
      );
    } else {
      this.showAvailableToast("You can select up to 3 coworkings only.");
      this.comboCoworkingInput.setValue(this.selectedCoworkings);
    }

    // Configurar el servicio para obtener los datos de ocupación
    /*const conf = this.service.getDefaultServiceConfiguration("occupation");
    this.service.configureService(conf);
    const filter = {
      cw_id: this.selectedCoworking,
    };
    const columns = ["data"];

    this.service.query(filter, columns, "occupationLinearChart").subscribe(
      (resp) => {
        if (resp.data && resp.data.length > 0) {
          const data = resp.data[0].data;
          this.chartData = this.transformOccupationData(data);
          this.isGraph = this.chartData.length > 0;
          this.cd.detectChanges();
        } else {
          this.isGraph = false;
        }
      },
      (error) => {
        console.error("Error al cargar datos de ocupación:", error);
        this.isGraph = false;
      }
    );
  }

  transformOccupationData(data: any): any[] {
    const chartData = [];
    if (data[this.selectedCoworking]) {
      const dateMap = data[this.selectedCoworking];
      for (const [date, percentage] of Object.entries(dateMap)) {
        chartData.push({
          name: new Date(date).toLocaleDateString(),
          value: percentage,
        });
      }
    }
    return chartData;
  }*/
  }
  showAvailableToast(mensaje?: string) {
    const availableMessage =
      mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 7500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }
}

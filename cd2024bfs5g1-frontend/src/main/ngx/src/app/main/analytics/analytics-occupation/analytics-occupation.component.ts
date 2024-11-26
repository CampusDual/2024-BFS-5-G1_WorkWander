import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  OComboComponent,
  OntimizeService,
  OSnackBarConfig,
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
  snackBarService: any;

  @ViewChild("comboCoworkingInput") comboCoworkingInput: OComboComponent;

  constructor(
    private service: OntimizeService,
    private cd: ChangeDetectorRef
  ) {}

  onCoworkingChange(selectednames: number[]) {
    if (selectednames.length <= 3) {
      this.selectedCoworkings = selectednames.map((id) => id.toString());
      this.selectedCoworking = this.selectedCoworkings.join(",");
      this.showSnackBar(
        `Selected coworkings: ${this.selectedCoworkings.join(", ")}`
      );
    } else {
      this.showSnackBar("You can select up to 3 coworkings only.");
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
  showSnackBar(arg0: string) {
    throw new Error("Method not implemented.");
  }
}

function ViewChild(selector: string) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return this[`_${propertyKey}`];
      },
      set: function (value) {
        this[`_${propertyKey}`] = value;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

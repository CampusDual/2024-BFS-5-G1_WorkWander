import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { OntimizeService } from "ontimize-web-ngx";

@Component({
  selector: "app-analytics-occupation",
  templateUrl: "./analytics-occupation.component.html",
  styleUrls: ["./analytics-occupation.component.css"],
})
export class AnalyticsOccupationComponent {
  selectedCoworkings: any[] = [];
  chartData: any[] = [];
  isGraph: boolean = false;
  selectedCoworking: string = "";
  chartParameters: any;
  colorScheme = ["#5AA454", "#A10A28", "#C7B42C"];

  constructor(
    private service: OntimizeService,
    private cd: ChangeDetectorRef
  ) {}

  onCoworkingChange(event: any) {
    if (this.selectedCoworkings.length < 3) {
      this.selectedCoworkings.push(event);
    } else {
      console.warn("Maximum of 3 coworkings can be selected.");
    }
    this.selectedCoworking = event;
    setTimeout(() => {
      this.loadOccupationData();
    });
  }

  loadOccupationData() {
    if (!this.selectedCoworking) {
      return;
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
}

import { Component } from "@angular/core";
import { OTranslateService } from "ontimize-web-ngx";

@Component({
  selector: "app-events-detail",
  templateUrl: "./events-detail.component.html",
  styleUrls: ["./events-detail.component.css"],
})
export class EventsDetailComponent {
  constructor(private translate: OTranslateService) {}

  durationConvert(minutes: number): String {
    const DurationHours = this.translate.get("HOURS_MESSAGE");
    const DurationMinutes = this.translate.get("MINUTES_MESSAGE");
    const NoDuration = this.translate.get("NO_DURATION");
    var horas: number = 0;
    var minutosRestantes: number = 0;
    var tiempo: String = "";

    if (minutes == null) {
      tiempo = `${NoDuration}`;
    } else {
      if (minutes >= 60) {
        horas = Math.floor(minutes / 60);
        minutosRestantes = minutes % 60;
        tiempo = `${horas} ${DurationHours} ${minutosRestantes} ${DurationMinutes}`;
      } else {
        tiempo = `${minutes} minutos`;
      }
    }
    return tiempo;
  }
}

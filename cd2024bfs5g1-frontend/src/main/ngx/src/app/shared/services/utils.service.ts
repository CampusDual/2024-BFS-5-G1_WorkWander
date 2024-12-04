import { Injectable } from '@angular/core';
import { OTranslateService } from 'ontimize-web-ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  language:string

  constructor(private translate: OTranslateService) { }

  /**
   * Método que retorna la fecha formateada según el idioma
   * @param rawDate
   * @returns string
   */
  formatDate(rawDate:number){
    const date = new Date(rawDate);
    this.language = this.translate.getCurrentLang();
    this.language === "es" ? (this.language = "es-ES") : (this.language = "en-US");
    return new Intl.DateTimeFormat(this.language, {year: 'numeric', month: 'long', day: 'numeric'}).format(date);
  }

  dateStartFunction(rowData: Array<any>): any {
    return rowData["dates"][0];
  }

  dateEndFunction(rowData: Array<any>): any {
    return rowData["dates"][rowData["dates"].length - 1];
  }

  /**
   * Método que retorna la hora en formato hh:mm
   * @param time
   * @returns string
   */
  formatTime(time:string):string{
    return `${time.substring(0,2)}:${time.substring(3,5)}`
  }

  calculateState(cellvalue: any, rowvalue?: Array<any>): string {
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    var startDate = new Date(rowvalue["dates"][0]);
    startDate.setHours(0, 0, 0, 0);
    var endDate = new Date(rowvalue["dates"][rowvalue["dates"].length - 1]);
    endDate.setHours(0, 0, 0, 0);
    var state = "Cancelada";
    if (rowvalue["bk_state"] === true) {
      if (currentDate < startDate) {
        state = "Pendiente";
      } else if (startDate <= currentDate && currentDate <= endDate) {
        state = "En curso";
      } else {
        state = "Finalizada";
      }
    }
    return state;
  }
}

import { Injectable } from '@angular/core';
import { OTranslateService } from 'ontimize-web-ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  language:string

  constructor(private translate: OTranslateService) { }

  formatDate(rawDate:number){
    const date = new Date(rawDate);
    this.language = this.translate.getCurrentLang();
    this.language === "es" ? (this.language = "es-ES") : (this.language = "en-US");
    return new Intl.DateTimeFormat(this.language, {year: 'numeric', month: 'long', day: 'numeric'}).format(date);
  }
}

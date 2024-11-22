import { Component } from '@angular/core';
import {
  OntimizeService,
} from "ontimize-web-ngx";

@Component({
  selector: 'app-analytics-occupation',
  templateUrl: './analytics-occupation.component.html',
  styleUrls: ['./analytics-occupation.component.css']
})
export class AnalyticsOccupationComponent {
  constructor(
    private service: OntimizeService,
  ){}
ngOnInit(){
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];
    const filter = {
      bk_state: true,
    };
    this.service.query(filter,columns, "occupationLinearChart").subscribe(
      (resp) => {
        console.log(resp.data.data)
      }
    )}
}

import { Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OBaseTableCellRenderer } from 'ontimize-web-ngx';

@Component({
  selector: 'app-bookings-state-render',
  templateUrl: './bookings-state-render.component.html',
  styleUrls: ['./bookings-state-render.component.css']
})
export class BookingsStateRenderComponent extends OBaseTableCellRenderer {
  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCellData(cellvalue: any, rowvalue?: Array<any>): string {
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0)
    var startDate = rowvalue["dates"][0];
    var endDate = rowvalue["dates"][rowvalue["dates"].length - 1];
    var state = "Cancelada"
    if (rowvalue["bk_state"] === true) {
      if (currentDate < startDate) {
        state = "Pendiente"
      } else if (startDate <= currentDate && currentDate <= endDate) {
        state = "En curso"
      } else {
        state = "Finalizada"
      }
    }
    return state;
  }
}

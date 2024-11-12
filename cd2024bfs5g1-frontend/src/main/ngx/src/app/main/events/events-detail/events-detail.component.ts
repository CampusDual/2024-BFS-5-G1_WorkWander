import { Component } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.css']
})
export class EventsDetailComponent {

  constructor(private utils:UtilsService){}

  formatDate(rawDate:number):string{
    return this.utils.formatDate(rawDate);
  }
}

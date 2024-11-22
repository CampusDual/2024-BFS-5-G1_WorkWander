import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-events-home',
  templateUrl: './my-events-home.component.html',
  styleUrls: ['./my-events-home.component.css']
})

export class MyEventsHomeComponent {
constructor(private router: Router) {

}

  openDetail(event: any) {
    this.router.navigate(["/main/myevents/" + event.row.id_event]);
  }

}

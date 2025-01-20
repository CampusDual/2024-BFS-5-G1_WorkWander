import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, OTableComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'app-my-events-home',
  templateUrl: './my-events-home.component.html',
  styleUrls: ['./my-events-home.component.css']
})

export class MyEventsHomeComponent {
  constructor(private router: Router,
    protected dialogService: DialogService,
  ) {

  }
  @ViewChild("table") table: OTableComponent;
  openEditWindow(event) {

  }
  ngOnInit() {
    setTimeout(() => { this.deleteLoader() }, 250);
  }

  deleteLoader() {
    const borrar = document.querySelector('#borrar') as HTMLDivElement;
    if (borrar) {
      borrar.textContent = "";
    }
  }
}

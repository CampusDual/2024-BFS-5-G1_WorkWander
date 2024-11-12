import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DialogService, OntimizeService, OTranslateService, SnackBarService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-coworkings-detail',
  templateUrl: './coworkings-detail.component.html',
  styleUrls: ['./coworkings-detail.component.css'],
})
export class CoworkingsDetailComponent  {

  serviceIcons = {
    additional_screen: 'desktop_windows',
    vending_machine: 'kitchen',
    coffee_bar: 'local_cafe',
    water_dispenser: 'local_drink',
    ergonomic_chair: 'event_seat',
    parking: 'local_parking'
  };

  constructor(
    private service: OntimizeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    protected dialogService: DialogService,
    protected snackBarService: SnackBarService,
    @Inject(AuthService) private authService: AuthService,
    private translate: OTranslateService,
    private location: Location
  ) { }

  goBack(): void {
    this.location.back();
  }
}

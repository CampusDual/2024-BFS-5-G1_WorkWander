import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DialogService, OntimizeService, OTranslateService, SnackBarService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-coworkings-detail',
  templateUrl: './coworkings-detail.component.html',
  styleUrls: ['./coworkings-detail.component.css'],
})
export class CoworkingsDetailComponent implements OnInit {

  coworking: any;
  serviceList = [];

  serviceIcons: { [key: string]: string } = {
    'additional_screen': 'assets/icons/desktop-computer.png',
    'vending_machine': 'assets/icons/vending-machine.png',
    'coffee_bar': 'assets/icons/coffee-shop.png',
    'water_dispenser': 'assets/icons/water-dispenser.png',
    'ergonomic_chair': 'assets/icons/chair.png',
    'parking': 'assets/icons/parking.png'
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

  ngOnInit(): void {
    this.loadCoworkingDetails();
    this.showServices();
  }

  goBack(): void {
    this.location.back();
  }

  loadCoworkingDetails(): void {
    const filter = {
      cw_id: +this.activeRoute.snapshot.params["cw_id"],
    };
    console.log('filter', filter);

    this.service.query(filter, ['cw_id', 'cw_name', 'cw_location', 'cw_capacity', 'cw_daily_price', 'cw_description', 'cw_image'], 'coworking').subscribe(
      response => {
        if (response.data && response.data.length > 0) {
          this.coworking = response.data[0];
        }
      },
      error => {
        console.error('Error loading coworking details', error);
      }
    );
  }

  showServices(): void {
    const filter = {
      cw_id: +this.activeRoute.snapshot.params["cw_id"],
    };
    console.log('filter', filter);

    const conf = this.service.getDefaultServiceConfiguration("cw_services");
    this.service.configureService(conf);
    const columns = ["srv_name"];
    this.service.query(filter, columns, "servicePerCoworking").subscribe(
      resp => {
        this.serviceList = resp.data;
      },
      error => {
        console.error('Error loading services', error);
      }
    );
  }
}
